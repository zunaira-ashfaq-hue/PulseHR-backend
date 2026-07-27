const Leave = require('../models/Leave');

exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    const leave = new Leave({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason
    });

    await leave.save();
    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeavesByEmployee = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.employeeId })
      .populate('employeeId', 'name email department')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employeeId', 'name email department')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json({ message: 'Leave status updated successfully', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
