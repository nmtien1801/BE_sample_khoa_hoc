"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Courses", [
      {
        title: "Lập trình JavaScript Cơ bản",
        subtitle: "Khóa học JavaScript từ zero đến hero",
        description:
          "Khóa học toàn diện về JavaScript, từ cú pháp cơ bản đến các khái niệm nâng cao như async/await, promises, và ES6+",
        summary: "Học JavaScript từ cơ bản đến nâng cao với các dự án thực tế",
        language: "Tiếng Việt",
        categoryId: 1, // Công nghệ thông tin
        teacherId: 1, // Nguyễn Văn A
        level: "beginner",
        duration: "40 giờ",
        price: "2990000",
        image: "/uploads/courses/javascript-basic.jpg",
        status: "published",
        tags: JSON.stringify(["javascript", "programming", "web-development"]),
        curriculum: JSON.stringify([
          "Giới thiệu về JavaScript",
          "Biến và kiểu dữ liệu",
          "Hàm và scope",
          "Object và Array",
          "DOM manipulation",
          "Async programming",
        ]),
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Khởi nghiệp từ A đến Z",
        subtitle: "Hành trình từ ý tưởng đến doanh nghiệp thành công",
        description:
          "Khóa học cung cấp kiến thức toàn diện về quá trình khởi nghiệp, từ việc phát triển ý tưởng, lập kế hoạch kinh doanh đến quản lý và phát triển doanh nghiệp",
        summary: "Học cách biến ý tưởng thành doanh nghiệp thực tế",
        language: "Tiếng Việt",
        categoryId: 2, // Kinh doanh khởi nghiệp
        teacherId: 2, // Trần Thị B
        level: "intermediate",
        duration: "30 giờ",
        price: "1990000",
        image: "/uploads/courses/startup-guide.jpg",
        status: "published",
        tags: JSON.stringify(["startup", "business", "entrepreneurship"]),
        curriculum: JSON.stringify([
          "Ý tưởng và xác thực",
          "Lập kế hoạch kinh doanh",
          "Tài chính khởi nghiệp",
          "Marketing và bán hàng",
          "Quản lý đội ngũ",
          "Phát triển bền vững",
        ]),
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Courses", null, {});
  },
};
