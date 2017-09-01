'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    text: DataTypes.STRING,
    like: DataTypes.INTEGER
  }, {});


  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      foreignKey: 'postId',
    })

    Post.hasOne(models.User, {
      foreignKey: 'postId',
      otherKey: 'userId',
      through: 'likes'
    })
  }

  
  return Post;
};
