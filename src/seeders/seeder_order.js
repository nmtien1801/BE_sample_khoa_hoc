"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Orders", [
      {
        orderId: "ORD-1001",
        userId: 1, // giả sử user id 2 là người mua
        courseId: 1, // giả sử course id 1
        quantity: 1,
        amount: 100.0,
        status: "completed",
        paymentMethod: "momo",
        notes: "Seeder: user bought course 1",
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Orders", { orderId: "ORD-1001" }, {});
  },
};
