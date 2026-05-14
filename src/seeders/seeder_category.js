"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Categories", [
      {
        name: "Công nghệ thông tin",
        slug: "cong-nghe-thong-tin",
        description:
          "Các khóa học về lập trình, phát triển phần mềm và công nghệ thông tin",
        type: "technology",
        parentId: null,
        icon: "💻",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kinh doanh khởi nghiệp",
        slug: "kinh-doanh-khoi-nghiep",
        description:
          "Kiến thức về khởi nghiệp, quản lý doanh nghiệp và phát triển kinh doanh",
        type: "business",
        parentId: null,
        icon: "💼",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
