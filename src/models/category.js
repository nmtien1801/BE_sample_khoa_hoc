"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      this.hasMany(models.Course, { foreignKey: "categoryId" });
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.TEXT,
      type: DataTypes.STRING,
      parentId: DataTypes.INTEGER,
      icon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
    },
  );
  return Category;
};
