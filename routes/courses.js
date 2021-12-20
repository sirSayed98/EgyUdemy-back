const express = require("express");
const {
  addCourse,
  getSingleCourses,
  getCourses,
  deleteCourse,
  askQuestion,
  answerQuestion,
  getCourseFAQs,
  getInstructorCourses,
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
router.get("/:id", getSingleCourses);
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

router.get("/:id/FAQs", getCourseFAQs);

module.exports = router;
