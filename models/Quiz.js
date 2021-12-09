const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a quiz title"],
  },

  section: {
    type: mongoose.Schema.ObjectId,
    ref: "Section",
    required: true,
  },
  questions: [
    {
      type: Array,
      default: [],
      required: true,
    },
  ],
  choices: [
    {
      type: Array,
      default: [],
      required: true,
    },
  ],
  answers: [
    {
      type: Array,
      default: [],
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);
