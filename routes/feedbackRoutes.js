const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const { auth, isAdmin } = require("../middleware/auth");

// Specific routes first
router.get("/my", auth, feedbackController.getMyFeedback);
router.get("/pending-count", auth, isAdmin, feedbackController.getPendingCount);

// General routes after
router.post("/", auth, feedbackController.submitFeedback);
router.get("/", auth, isAdmin, feedbackController.getAllFeedback);

module.exports = router;
