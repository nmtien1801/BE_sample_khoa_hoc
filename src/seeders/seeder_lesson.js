"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Lessons", [
      {
        title: "Giới thiệu về JavaScript",
        description:
          "Tìm hiểu về JavaScript là gì và tại sao nó quan trọng trong phát triển web",
        content:
          "JavaScript là ngôn ngữ lập trình phổ biến nhất thế giới, được sử dụng để tạo ra các trang web động và tương tác...",
        duration: "30 phút",
        videoUrl: "https://example.com/videos/js-intro.mp4",
        resources: JSON.stringify([
          {
            type: "pdf",
            url: "/resources/js-intro-slides.pdf",
            name: "Slides bài giảng",
          },
          {
            type: "code",
            url: "/resources/js-intro-examples.zip",
            name: "Code ví dụ",
          },
        ]),
        courseId: 1, // Lập trình JavaScript Cơ bản
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Biến và kiểu dữ liệu",
        description:
          "Học cách khai báo biến và làm việc với các kiểu dữ liệu trong JavaScript",
        content:
          "Trong JavaScript, chúng ta sử dụng var, let, const để khai báo biến. Các kiểu dữ liệu bao gồm: string, number, boolean, object, array...",
        duration: "45 phút",
        videoUrl: "https://example.com/videos/js-variables.mp4",
        resources: JSON.stringify([
          {
            type: "exercise",
            url: "/exercises/js-variables.html",
            name: "Bài tập thực hành",
          },
        ]),
        courseId: 1, // Lập trình JavaScript Cơ bản
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Ý tưởng và xác thực",
        description: "Cách tìm và xác thực ý tưởng kinh doanh tiềm năng",
        content:
          "Khởi nghiệp bắt đầu từ ý tưởng. Học cách tìm ý tưởng, đánh giá tiềm năng và xác thực với thị trường...",
        duration: "40 phút",
        videoUrl: "https://example.com/videos/startup-idea.mp4",
        resources: JSON.stringify([
          {
            type: "template",
            url: "/templates/idea-validation.xlsx",
            name: "Bảng xác thực ý tưởng",
          },
        ]),
        courseId: 2, // Khởi nghiệp từ A đến Z
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Lập kế hoạch kinh doanh",
        description: "Cách xây dựng business plan chi tiết và hiệu quả",
        content:
          "Business plan là bản đồ đường cho doanh nghiệp. Học cách phân tích thị trường, đối thủ cạnh tranh, chiến lược marketing...",
        duration: "60 phút",
        videoUrl: "https://example.com/videos/business-plan.mp4",
        resources: JSON.stringify([
          {
            type: "template",
            url: "/templates/business-plan.docx",
            name: "Mẫu business plan",
          },
          {
            type: "case-study",
            url: "/case-studies/successful-startups.pdf",
            name: "Case study doanh nghiệp thành công",
          },
        ]),
        courseId: 2, // Khởi nghiệp từ A đến Z
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Lessons", null, {});
  },
};
