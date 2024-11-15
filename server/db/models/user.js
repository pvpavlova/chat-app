"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Post, Photo }) {
      this.hasMany(Post, { foreignKey: "userId" });
      this.hasMany(Photo, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profilePicture: DataTypes.STRING,
      coverPicture: DataTypes.STRING,
      followerID: DataTypes.INTEGER,
      followingID: DataTypes.INTEGER,
      isAdmin: DataTypes.BOOLEAN,
      description: DataTypes.STRING,
      city: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
