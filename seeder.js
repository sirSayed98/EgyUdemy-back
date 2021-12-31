const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const User = require("./models/User");
const Course = require("./models/Course");
const Answer = require("./models/Answer");
const FAQ = require("./models/FAQs");
const Secion = require("./models/Section");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const answers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/answers.json`, "utf-8")
);
const faqs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/faqs.json`, "utf-8")
);
const sections = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/sections.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Course.create(courses);
    await Answer.create(answers);
    await FAQ.create(faqs);
    await Secion.create(sections);

    console.log("Data Imported...".bgGreen.white);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Answer.deleteMany();
    await FAQ.deleteMany();
    await Secion.deleteMany();

    console.log("Data Destroyed...".bgRed.white);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
