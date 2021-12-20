const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const FAQs = require("../models/FAQs");
const Answer = require("../models/Answer");

// @desc      Add course
// @route     POST /api/v1/courses
// @access    Private (admin-intructor)
exports.addCourse = asyncHandler(async (req, res, next) => {
  //req.body.instructor = req.user._id;
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
exports.getSingleCourses = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "userName")
    .populate("sections", "title description")
    .populate({
      path: "FAQs",
      select: "answer title createdAt",
      populate: {
        path: "answers",
        select: "answer userID",
      },
    });
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Get single course
// @route     Get /api/v1/courses/:id
// @access    Private(admin)
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  await Course.findByIdAndDelete(req.params.id);
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
