"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      this.belongsTo(models.Category, { foreignKey: "categoryId" });
      this.belongsTo(models.Teacher, { foreignKey: "teacherId" });
      this.hasMany(models.Lesson, { foreignKey: "courseId" });
    }
  }
  Course.init(
    {
      title: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      description: DataTypes.TEXT,
      summary: DataTypes.TEXT,
      language: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER,
      level: DataTypes.STRING,
      duration: DataTypes.STRING,
      price: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.STRING,
      tags: DataTypes.JSON,
      featured: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Course",
    },
  );
  return Course;
};
