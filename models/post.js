'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    userId: DataTypes.INTEGER,
    text: DataTypes.STRING,
    like: DataTypes.INTEGER
  }, {});


  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    })

    Post.hasMany(models.Like, {
      as: "likes",
      foreignKey: 'userId'
    })
  }


  return Post;
};
