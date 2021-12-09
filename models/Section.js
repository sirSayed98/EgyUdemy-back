const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a section title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },

  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  activitiesVideos: {
    type: Array,
    default: [],
  },
  activitiesPDFs: {
    type: Array,
    default: [],
  },
  activitiesQuiz: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Quiz",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Section", SectionSchema);
