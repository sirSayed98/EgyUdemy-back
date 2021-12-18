const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  sections: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
    },
  ],
  subscribers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  FAQs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "FAQ",
      default: [],
    },
  ],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model("Course", CourseSchema);
