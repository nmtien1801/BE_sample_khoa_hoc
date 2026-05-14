"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Course", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      subtitle: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      summary: {
        type: Sequelize.TEXT,
      },
      language: {
        type: Sequelize.STRING,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      teacherId: {
        type: Sequelize.INTEGER,
      },
      level: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      tags: {
        type: Sequelize.JSON,
      },
      curriculum: {
        type: Sequelize.JSON,
      },
      featured: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Course");
  },
};

// npx sequelize-cli db:migrate --to migrate_courses.js