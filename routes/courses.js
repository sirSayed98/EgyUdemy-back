const express = require("express");
const {
  addCourse,
  getSingleCourses,
  getCourses,
} = require("../controllers/courses");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("admin", "instructor"), addCourse);
router.get("/", getCourses);
router.get("/:id", getSingleCourses);

module.exports = router;
