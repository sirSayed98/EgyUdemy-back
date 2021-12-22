const express = require("express");
const {
  addSection,
  addActivityVideo,
  getSingleSection,
  addActivityPDF,
  editSection,
} = require("../controllers/sections");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");
router.put("/:id", protect, authorize("admin", "instructor"), editSection);

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
router.get("/:id", getSingleSection);
module.exports = router;
