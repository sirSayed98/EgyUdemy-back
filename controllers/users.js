const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const Course = require("../models/Course");

// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find(
    {},
    { userName: 1, email: 1, role: 1, createdAt: 1 }
  );
  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/toggleLearner/:id
// @access    Private/Admin
exports.toggleLearner = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`This user not found`, 400));
  }
  user.role = "instructor";
  await user.save();
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user
// @route     PUT /api/v1/users/enroll/:id
// @access    Private (Learner)
exports.enroll = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  let user = req.user;

  user.courses.forEach((id) => {
    if (JSON.stringify(id) === JSON.stringify(course._id)) {
      return next(new ErrorResponse(`this user has enrolled before `, 400));
    }
  });

  user.courses.push(course._id);

  let prorgress = {};
  prorgress.courseID = course._id;
  prorgress.sections = [];

  course.sections.forEach((sectionID) => {
    let quizSection = {};
    quizSection.id = sectionID;
    quizSection.grade = 0;
    quizSection.passed = false;
    prorgress.sections.push(quizSection);
  });

  user.progress = [...user.progress, prorgress];

  await user.save();
  course.subscribers.push(user._id);
  await course.save();

  res.status(200).json({
    success: true,
    user,
    course,
  });
});

// @desc      Update user
// @route     PUT /api/v1/users/available-courses
// @access    Private (Learner)

exports.getAvailableCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find();
  let userCourses = req.user.courses;
  let availableCourses = [];

  courses.forEach((course) => {
    if (!userCourses.includes(course._id)) availableCourses.push(course);
  });
  res.status(200).json({
    success: true,
    courses: availableCourses,
  });
});
