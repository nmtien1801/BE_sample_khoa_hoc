"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Teachers", [
      {
        name: "Nguyễn Văn A",
        title: "Senior Software Engineer",
        bio: "Chuyên gia phát triển phần mềm với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ thông tin",
        email: "nguyenvana@example.com",
        phone: "+84 123 456 789",
        avatar: "/uploads/teachers/nguyen-vana.jpg",
        languageSpecialty: "JavaScript, Node.js",
        experienceYears: 10,
        socialLinks: JSON.stringify({
          linkedin: "https://linkedin.com/in/nguyenvana",
          github: "https://github.com/nguyenvana",
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Trần Thị B",
        title: "Business Consultant",
        bio: "Chuyên gia tư vấn kinh doanh với kinh nghiệm dày dặn trong lĩnh vực khởi nghiệp và quản lý doanh nghiệp",
        email: "tranthib@example.com",
        phone: "+84 987 654 321",
        avatar: "/uploads/teachers/tran-thi-b.jpg",
        languageSpecialty: "Tiếng Việt, Tiếng Anh",
        experienceYears: 8,
        socialLinks: JSON.stringify({
          linkedin: "https://linkedin.com/in/tranthib",
          facebook: "https://facebook.com/tranthib",
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Teachers", null, {});
  },
};
