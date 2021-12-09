const express = require("express");
const {
  addSection,
  addActivityVideo,
  addActivityPDF,
} = require("../controllers/sections");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post(
  "/course/:courseId",
  protect,
  authorize("admin", "instructor"),
  addSection
);
router.put(
  "/:sectionId/video",
  protect,
  authorize("admin", "instructor"),
  addActivityVideo
);
router.put(
  "/:sectionId/pdf",
  protect,
  authorize("admin", "instructor"),
  addActivityPDF
);
module.exports = router;
