"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    dialect: config.dialect,
  },
);

const db = {};

const modelDefiners = [
  require("./user"),
  require("./category"),
  require("./teacher"),
  require("./course"),
  require("./lesson"),
];

for (const defineModel of modelDefiners) {
  const model = defineModel(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
