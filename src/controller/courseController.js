import courseService from "../service/courseService.js";

// ─────────────────────────────────────────────────────────────────────────────
// Bảo mật: Xoá hoàn toàn videoUrl khỏi mọi response trả về Frontend.
// Frontend dùng lessonId để xin Signed Token qua POST /api/v1/video/token.
// ─────────────────────────────────────────────────────────────────────────────
const sanitizeLessonData = (lesson) => {
  if (!lesson) return lesson;
  const plain = lesson.get ? lesson.get({ plain: true }) : { ...lesson };
  // Xoá videoUrl — không để lộ link YouTube dưới bất kỳ hình thức nào
  const { videoUrl, ...safeLesson } = plain;
  return safeLesson;
};

const sanitizeCourseData = (course) => {
  if (!course) return course;
  const plain = course.get ? course.get({ plain: true }) : { ...course };
  return {
    ...plain,
    Lessons: plain.Lessons ? plain.Lessons.map(sanitizeLessonData) : [],
  };
};

const getAllCourses = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      teacher: req.query.teacher,
      title: req.query.title,
    };
    const courses = await courseService.getAllCourses(filters);
    const sanitizedCourses = courses.map(sanitizeCourseData);
    res.json({ data: sanitizedCourses, total: sanitizedCourses.length });
  } catch (error) {
    console.error("courseController getAllCourses", error);
    res.status(500).json({ message: "Internal server error", error, data: [] });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// BỔ SUNG: Lấy danh sách khóa học user đã mua thành công
// API này thường chạy qua middleware checkUserJwt để lấy req.user.id,
// hoặc lấy userId trực tiếp từ URL params (req.params.userId) tùy bạn cấu hình.
// ─────────────────────────────────────────────────────────────────────────────
const getCoursesByUserId = async (req, res) => {
  try {
    // Ưu tiên lấy từ req.user.id (do middleware JWT giải mã) hoặc từ URL params
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // Gọi xuống service để xử lý câu lệnh tìm kiếm/join bảng Order
    const courses = await courseService.getCoursesByUserId(userId);

    // Đưa qua hàm sanitize dữ liệu để xóa videoUrl bảo mật
    const sanitizedCourses = courses.map(sanitizeCourseData);

    res.json({ data: sanitizedCourses, total: sanitizedCourses.length });
  } catch (error) {
    console.error("courseController getCoursesByUserId", error);
    res.status(500).json({ message: "Internal server error", data: [] });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Course not found", data: null });
    res.json({ data: sanitizeCourseData(course) });
  } catch (error) {
    console.error("courseController getCourseById", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const createCourse = async (req, res) => {
  try {
    const newCourse = await courseService.createCourse(req.body);
    res.status(201).json({ message: "Course created", data: newCourse });
  } catch (error) {
    console.error("courseController createCourse", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updated = await courseService.updateCourse(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Course not found", data: null });
    res.json({ message: "Course updated", data: updated });
  } catch (error) {
    console.error("courseController updateCourse", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const removed = await courseService.deleteCourse(req.params.id);
    if (!removed)
      return res.status(404).json({ message: "Course not found", data: null });
    res.json({ message: "Course deleted", data: removed });
  } catch (error) {
    console.error("courseController deleteCourse", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

export default {
  getAllCourses,
  getCoursesByUserId,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
