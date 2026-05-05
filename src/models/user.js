"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      role: DataTypes.STRING,
      languagePreference: DataTypes.STRING,
      bio: DataTypes.TEXT,
      status: DataTypes.STRING,
      lastLogin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
