import express from "express";
import courseController from "../controller/courseController.js";
import categoryController from "../controller/categoryController.js";
import teacherController from "../controller/teacherController.js";
import lessonController from "../controller/lessonController.js";

const router = express.Router();

const SampleApi = (app) => {
  router.get("/sample/categories", categoryController.getAllCategories);
  router.get("/sample/categories/:id", categoryController.getCategoryById);
  router.post("/sample/categories", categoryController.createCategory);
  router.put("/sample/categories/:id", categoryController.updateCategory);
  router.delete("/sample/categories/:id", categoryController.deleteCategory);

  router.get("/sample/teachers", teacherController.getAllTeachers);
  router.get("/sample/teachers/:id", teacherController.getTeacherById);
  router.post("/sample/teachers", teacherController.createTeacher);
  router.put("/sample/teachers/:id", teacherController.updateTeacher);
  router.delete("/sample/teachers/:id", teacherController.deleteTeacher);

  router.get("/sample/courses", courseController.getAllCourses);
  router.get("/sample/courses/:id", courseController.getCourseById);
  router.post("/sample/courses", courseController.createCourse);
  router.put("/sample/courses/:id", courseController.updateCourse);
  router.delete("/sample/courses/:id", courseController.deleteCourse);

  router.get("/sample/lessons", lessonController.getAllLessons);
  router.get("/sample/lessons/:id", lessonController.getLessonById);
  router.post("/sample/lessons", lessonController.createLesson);
  router.put("/sample/lessons/:id", lessonController.updateLesson);
  router.delete("/sample/lessons/:id", lessonController.deleteLesson);

  return app.use("/api", router);
};

export default SampleApi;
