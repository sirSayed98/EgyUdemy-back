const express = require("express");
const {
  toggleLearner,
  getUsers,
  enroll,
  getAvailableCourses,
} = require("../controllers/users");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin"), getUsers);
router.get(
  "/available-courses",
  protect,
  authorize("learner"),
  getAvailableCourses
);
router.put("/toggleLearner/:id", protect, authorize("admin"), toggleLearner);
router.put("/enroll/:id", protect, authorize("learner"), enroll);

module.exports = router;
