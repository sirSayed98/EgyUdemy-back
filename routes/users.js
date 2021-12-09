const express = require("express");
const { toggleLearner, getUsers } = require("../controllers/users");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.put("/toggleLearner/:id", protect, authorize("admin"), toggleLearner);
router.get("/", protect, authorize("admin"), getUsers);
module.exports = router;
