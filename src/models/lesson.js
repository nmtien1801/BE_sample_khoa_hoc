"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      this.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Lesson.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      content: DataTypes.TEXT,
      duration: DataTypes.STRING,
      videoUrl: DataTypes.STRING,
      resources: DataTypes.JSON,
      courseId: DataTypes.INTEGER,
      order: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Lesson",
    },
  );
  return Lesson;
};
