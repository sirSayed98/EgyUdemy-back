const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Section = require("../models/Section");
const Quiz = require("../models/Quiz");

// @desc      Add Video course
// @route     PUT /api/v1/quiz/:sectionId
// @access    Private (admin-instructor)
exports.addQuiz = asyncHandler(async (req, res, next) => {
  let section = await Section.findById(req.params.sectionId);
  req.body.section = req.params.sectionId;

  const quiz = await Quiz.create(req.body);
  section.activitiesQuiz = [...section.activitiesQuiz, quiz._id];

  await section.save();

  res.status(200).json({
    success: true,
    section,
    quiz,
  });
});
