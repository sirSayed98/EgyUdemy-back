const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const FAQs = require("../models/FAQs");
const Answer = require("../models/Answer");
const User = require("../models/User");

// @desc      Add course
// @route     POST /api/v1/courses
// @access    Private (admin-intructor)
exports.addCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.create(req.body);
  let user = await User.findById(req.user.id);
  user.courses = [...user.courses, course._id];

  await user.save();

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Get All courses
// @route     Get /api/v1/courses/
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find()
    .populate("sections", "title")
    .populate("instructor", "userName");
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

exports.getInstructorCourses = asyncHandler(async (req, res, next) => {
  let courses;
  if (req.user.role === "admin") courses = await Course.find({}, { title: 1 });
  else courses = await Course.find({ instructor: req.user._id }, { title: 1 });

  res.status(200).json({
    success: true,
    data: courses,
  });
});

// @desc      Get single course
// @route     Get /api/v1/courses/:id
// @access    Public
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate(
      "instructor",
      "userName firstName lastName instructorDesc courses"
    )
    .populate("sections", "title description activitiesVideos activitiesPDFs")
    .populate({
      path: "FAQs",
      select: "answer title createdAt",
      populate: {
        path: "answers",
        select: "answer userID userName createdAt",
      },
    });
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Get single course
// @route     Get /api/v1/courses/:id
// @access    Private(admin-Instructor)
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  await checkCourseInstructor(req, next);
  const course = await Course.findByIdAndDelete(req.params.id);

  let user = await User.findById(course.instructor);
  let index = user?.courses.indexOf(req.params.id);

  if (index !== -1) {
    user.courses.splice(index, 1);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      ASK Question
// @route     POST /api/v1/courses/:id/ask
// @access    Private (Learner-instructor-admin)

exports.askQuestion = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`course with id ${req.params.id} not found`, 404)
    );
  }
  const faq = await FAQs.create({
    ...req.body,
    userID: req.user.id,
    courseID: course.id,
  });

  course.FAQs = [...course.FAQs, faq.id];

  await course.save();

  res.status(200).json({
    success: true,
    course,
    faq,
  });
});

// @desc      Make Answer
// @route     POST /api/v1/course/:FAQID/answer
// @access    Private (Learner-instructor-admin)

exports.answerQuestion = asyncHandler(async (req, res, next) => {
  let FAQ = await FAQs.findById(req.params.FAQID);

  if (!FAQ) {
    return next(
      new ErrorResponse(`FAQ with id ${req.params.FAQID} not found`, 404)
    );
  }
  const answer = await Answer.create({
    ...req.body,
    faqID: FAQ.id,
    userID: req.user.id,
    userName: req.user.userName,
  });

  FAQ.answers = [...FAQ.answers, answer.id];

  await FAQ.save();

  res.status(200).json({
    success: true,
    FAQ,
    answer,
  });
});

// @desc      Get Answers
// @route     POST /api/v1/course/:id/FAQs
// @access    Public

exports.getCourseFAQs = asyncHandler(async (req, res, next) => {
  const faqs = await FAQs.find({ courseID: req.params.id })
    .populate({
      path: "answers",
      select: "answer createdAt",
      populate: {
        path: "userID",
        select: "userName",
      },
    })
    .populate("userID", "userName");

  res.status(200).json({
    success: true,
    faqs,
  });
});

// @desc      Edit Course
// @route     PUT /api/v1/course/:id/
// @access    Private (admin-instructor)

exports.editCourse = asyncHandler(async (req, res, next) => {
  await checkCourseInstructor(req, next);

  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    course,
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
