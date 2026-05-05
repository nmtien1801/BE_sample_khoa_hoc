"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      this.hasMany(models.Course, { foreignKey: "teacherId" });
    }
  }
  Teacher.init(
    {
      name: DataTypes.STRING,
      title: DataTypes.STRING,
      bio: DataTypes.TEXT,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      avatar: DataTypes.STRING,
      languageSpecialty: DataTypes.STRING,
      experienceYears: DataTypes.INTEGER,
      socialLinks: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Teacher",
    },
  );
  return Teacher;
};
