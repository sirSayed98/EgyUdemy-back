const mongoose = require("mongoose");

const QuestionFAQSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a question title"],
  },

  courseID: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Answer",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FAQ", QuestionFAQSchema);
