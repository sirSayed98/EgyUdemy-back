const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Section = require("../models/Section");
const Course = require("../models/Course");

// @desc      Add Video course
// @route     PUT /api/v1/sections/course/:courseId
// @access    Private (admin-instructor)
exports.addSection = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.courseId);
  req.body.course = req.params.courseId;

  const section = await Section.create(req.body);
  course.sections = [...course.sections, section._id];

  await course.save();

  res.status(200).json({
    success: true,
    section,
    course,
  });
});

// @desc      Add Video course
// @route     PUT /api/v1/sections/:sectionId/video
// @access    Private (admin-instructor)

exports.addActivityVideo = asyncHandler(async (req, res, next) => {
  let section = await Section.findById(req.params.sectionId);
  section.activitiesVideos = [...section.activitiesVideos, req.body];

  await section.save();
  res.status(200).json({
    success: true,
    data: section,
  });
});

// @desc      Add Video course
// @route     PUT /api/v1/sections/:sectionId/pdf
// @access    Private (admin-instructor)
exports.addActivityPDF = asyncHandler(async (req, res, next) => {
  let section = await Section.findById(req.params.sectionId);
  section.activitiesPDFs = [...section.activitiesPDFs, req.body];

  await section.save();
  res.status(200).json({
    success: true,
    data: section,
  });
});
