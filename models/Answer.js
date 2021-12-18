const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answer: {
    type: String,
    trim: true,
    required: [true, "Please add a answer for question"],
  },

  faqID: {
    type: mongoose.Schema.ObjectId,
    ref: "FAQ",
    required: true,
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Answer", AnswerSchema);
