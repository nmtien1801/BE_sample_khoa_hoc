"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Payments", [
      {
        orderId: "ORD-1001",
        transactionId: "TXN-1001",
        paymentMethod: "momo",
        status: "success",
        responseCode: "00",
        responseMessage: "OK",
        amount: 100.0,
        paidAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "Payments",
      { transactionId: "TXN-1001" },
      {},
    );
  },
};
