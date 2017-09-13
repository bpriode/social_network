const express  = require("express");
const models     = require("../models/index")
const bcrypt   = require("bcrypt");
const passport = require('passport');

const router  = express.Router();


const isAuthenticated = function (req, res, next) {
req.isAuthenticated();
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }

router.get("/", function(req, res) {
  res.render("signup", {
      messages: res.locals.getMessages()
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
  let displayname = req.body.displayname
  let username = req.body.username
  let password = req.body.password

  if (!username || !password) {
    req.flash('error', "Please, fill in all the fields.")
    res.redirect('/signup')
  }

  let salt = bcrypt.genSaltSync(10)
  let hashedPassword = bcrypt.hashSync(password, salt)

  let newUser = {
    displayname: displayname,
    username: username,
    salt: salt,
    passwordhash: hashedPassword
  }

  models.User.create(newUser).then(function() {
    res.redirect('/')
  }).catch(function(error) {
    req.flash('error', "Please, choose a different username.")
    res.redirect('/signup')
  });
});

router.get("/user", isAuthenticated, function(req, res) {
  models.Post.findAll({
    order: [['createdAt', 'Desc']],
    include: [
      {model: models.User, as: 'user'},
      {model: models.Like, as: 'likes'}
    ]
  })
  .then(function(posts){
    posts.forEach(function(post){
      if (post.userId === req.user.id) {
        post.canDelete = true
    }
  })
    res.render('user', {post: posts})
  })
});


router.post('/user', isAuthenticated, function (req, res, next) {
  models.Post.create({
    text: req.body.text,
    userId: req.user.id,
  })
  .then(function(data) {
    res.redirect('/user');
  })
});

// router.post('/like/:id', isAuthenticated, function(req, res) {
//   // models.Like.create({
//   //
//   // })
// })

router.delete('/destroy/:id', isAuthenticated, function(req, res, next) {
    models.Post.destroy({
      where: {
        id: req.params.id
      }
    })
  .then(function(data) {
    res.redirect('/user');
  })
  .catch(function(err){
    res.send(err)
  })
})


router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
