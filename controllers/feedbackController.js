const Feedback = require("../models/Feedback");

// Submit feedback (employee)
exports.submitFeedback = async (req, res) => {
  try {
    const { type, subject, message, isAnonymous } = req.body;

    const feedback = new Feedback({
      employeeId: req.employee._id,
      type,
      subject,
      message,
      isAnonymous,
    });

    await feedback.save();
    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my feedback (employee)
exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ employeeId: req.employee._id }).sort(
      { createdAt: -1 },
    );
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feedback (admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("employeeId", "name email department")
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending feedback count
exports.getPendingCount = async (req, res) => {
  try {
    const count = await Feedback.countDocuments({ status: "pending" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
