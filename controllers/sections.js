const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Section = require("../models/Section");
const Course = require("../models/Course");

// @desc      Add Video course
// @route     PUT /api/v1/sections/course/:courseId
// @access    Private (admin-instructor)
exports.addSection = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(`the course with id ${req.params.id} not found `, 404)
    );
  }
  const userRole = req.user.role;
  const userID = req.user._id;

  if (
    userRole === "instructor" &&
    JSON.stringify(userID) !== JSON.stringify(course.instructor)
  ) {
    return next(
      new ErrorResponse(
        `this instructor doesn't allow to add sections to this course`,
        400
      )
    );
  }
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
// @desc      Add Video course
// @route     GET /api/v1/sections/:id
// @access    Public
exports.getSingleSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: section,
  });
});

// @desc      Add Video course
// @route     PUT /api/v1/sections/:id
// @access    Private (admin-instructor)

exports.editSection = asyncHandler(async (req, res, next) => {
  let section = await Section.findById(req.params.id).populate(
    "course",
    "instructor"
  );

  if (
    req.user.role === "instructor" &&
    JSON.stringify(req.user.id) !== JSON.stringify(section.course?.instructor)
  ) {
    return next(
      new ErrorResponse(
        `this instructor doesn't allow to add video to this course`,
        400
      )
    );
  }

  section.title = req.body.title;
  section.description = req.body.description;
  await section.save();
  
  res.status(200).json({
    success: true,
    data: section,
  });
});
