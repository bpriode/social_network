'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    displayname: DataTypes.STRING,
    username: DataTypes.STRING,
    passwordhash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});


    User.associate = function(models) {
      User.hasMany(models.Post, {
        as: "Posts",
        foreignKey: 'postId'
      })


      User.belongsToMany(models.Post, {
        foreignKey: 'userId',
        otherKey: 'postId',
        through: 'likes'
      })
    }




  return User;
};
