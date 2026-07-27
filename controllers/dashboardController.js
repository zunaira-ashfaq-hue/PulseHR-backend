const Employee = require('../models/Employee');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    
    const employeesByDepartment = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    const approvedLeaves = await Leave.countDocuments({ status: 'approved' });
    const rejectedLeaves = await Leave.countDocuments({ status: 'rejected' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const presentToday = await Attendance.countDocuments({
      date: today,
      status: 'present'
    });

    res.json({
      totalEmployees,
      employeesByDepartment,
      leaveStats: {
        pending: pendingLeaves,
        approved: approvedLeaves,
        rejected: rejectedLeaves
      },
      presentToday
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
