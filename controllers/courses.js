const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");

// @desc      Add course
// @route     POST /api/v1/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.instructor = req.user._id;
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Add Video course
// @route     PUT /api/v1/courses/:id/video
// @access    Private
exports.addActivityVideo = asyncHandler(async (req, res, next) => {
  let course = await checkCourseInstructor(req);
  course.activitiesVideos = [...course.activitiesVideos, ...req.body.videos];

  await course.save();
  res.status(200).json({
    success: true,
    data: course,
  });
});
// @desc      Add PDF course
// @route     PUT /api/v1/courses/:id/pdf
// @access    Private
exports.addActivityPDF = asyncHandler(async (req, res, next) => {
  let course = await checkCourseInstructor(req);
  course.activitiesPDFs = [...course.activitiesPDFs, ...req.body.pdfs];

  await course.save();
  res.status(200).json({
    success: true,
    data: course,
  });
});

const checkCourseInstructor = async (req) => {
  let course = await Course.findById(req.params.id);

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
        `this instructor doesn't allow to add video to this course`,
        400
      )
    );
  }
  return course;
};
