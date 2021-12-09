const express = require("express");
const {
  addCourse,
  addActivityVideo,
  addActivityPDF,
} = require("../controllers/courses");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("admin", "instructor"), addCourse);

router.put(
  "/:id/video",
  protect,
  authorize("admin", "instructor"),
  addActivityVideo
);
router.put(
  "/:id/pdf",
  protect,
  authorize("admin", "instructor"),
  addActivityPDF
);
module.exports = router;
