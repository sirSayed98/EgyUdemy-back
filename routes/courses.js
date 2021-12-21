const express = require("express");
const {
  addCourse,
  getSingleCourse,
  getCourses,
  deleteCourse,
  askQuestion,
  answerQuestion,
  getCourseFAQs,
  getInstructorCourses,
  editCourse,
} = require("../controllers/courses");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.get(
  "/instructor",
  protect,
  authorize("instructor", "admin"),
  getInstructorCourses
);
router.post("/", protect, authorize("admin", "instructor"), addCourse);
router.get("/", getCourses);
router.get("/:id", getSingleCourse);
router.delete("/:id", protect, authorize("admin", "instructor"), deleteCourse);
router.post(
  "/:id/ask",
  protect,
  authorize("admin", "learner", "instructor"),
  askQuestion
);
router.post(
  "/:FAQID/answer",
  protect,
  authorize("admin", "learner", "instructor"),
  answerQuestion
);

router.put("/:id", protect, authorize("admin", "instructor"), editCourse);

router.get("/:id/FAQs", getCourseFAQs);

module.exports = router;
