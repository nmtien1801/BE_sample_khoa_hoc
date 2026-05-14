import express from "express";
import courseController from "../controller/courseController.js";
import categoryController from "../controller/categoryController.js";
import teacherController from "../controller/teacherController.js";
import lessonController from "../controller/lessonController.js";

const router = express.Router();

const SampleApi = (app) => {
  router.get("/categories", categoryController.getAllCategories);
  router.get("/categories/:id", categoryController.getCategoryById);
  router.post("/categories", categoryController.createCategory);
  router.put("/categories/:id", categoryController.updateCategory);
  router.delete("/categories/:id", categoryController.deleteCategory);

  router.get("/teachers", teacherController.getAllTeachers);
  router.get("/teachers/:id", teacherController.getTeacherById);
  router.post("/teachers", teacherController.createTeacher);
  router.put("/teachers/:id", teacherController.updateTeacher);
  router.delete("/teachers/:id", teacherController.deleteTeacher);

  router.get("/courses", courseController.getAllCourses);
  router.get("/courses/:id", courseController.getCourseById);
  router.post("/courses", courseController.createCourse);
  router.put("/courses/:id", courseController.updateCourse);
  router.delete("/courses/:id", courseController.deleteCourse);

  router.get("/lessons", lessonController.getAllLessons);
  router.get("/lessons/:id", lessonController.getLessonById);
  router.post("/lessons", lessonController.createLesson);
  router.put("/lessons/:id", lessonController.updateLesson);
  router.delete("/lessons/:id", lessonController.deleteLesson);

  return app.use("/api/v1", router);
};

export default SampleApi;
