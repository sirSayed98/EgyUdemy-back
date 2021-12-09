const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");

// @desc      Add course
// @route     POST /api/v1/courses
// @access    Private (admin-intructor)
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.instructor = req.user._id;
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Get All courses
// @route     Get /api/v1/courses/
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc      Get single course
// @route     Get /api/v1/courses/:id
// @access    Public
exports.getSingleCourses = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: course,
  });
});

const checkCourseInstructor = async (req, next) => {
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
