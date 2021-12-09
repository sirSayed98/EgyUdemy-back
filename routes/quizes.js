const express = require("express");
const { addQuiz } = require("../controllers/quizes");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/:sectionId", protect, authorize("admin", "instructor"), addQuiz);

module.exports = router;
