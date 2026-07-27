const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, notes } = req.body;

    // Prevent users from marking their own attendance
    if (employeeId === req.employee._id.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot mark your own attendance" });
    }

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: new Date(date),
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
    }

    const attendance = new Attendance({
      employeeId,
      date,
      status,
      checkIn,
      checkOut,
      notes,
      markedBy: req.employee._id,
    });

    await attendance.save();
    res
      .status(201)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employeeId: req.params.employeeId,
    })
      .populate("employeeId", "name email department")
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employeeId", "name email department")
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { status, checkIn, checkOut, notes } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, checkIn, checkOut, notes },
      { new: true },
    );

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json({ message: "Attendance updated successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Allow employees to mark their own attendance
exports.markSelfAttendance = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already exists for today
    let attendance = await Attendance.findOne({
      employeeId,
      date: today,
    });

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!attendance) {
      // First check-in of the day
      attendance = new Attendance({
        employeeId,
        date: today,
        status: "present",
        checkIn: currentTime,
        markedBy: employeeId,
      });
      await attendance.save();
      return res.status(201).json({
        message: "Checked in successfully",
        attendance,
        action: "checkIn",
      });
    } else {
      // Check-out
      if (!attendance.checkOut) {
        attendance.checkOut = currentTime;
        await attendance.save();
        return res.json({
          message: "Checked out successfully",
          attendance,
          action: "checkOut",
        });
      } else {
        return res.status(400).json({
          message: "You have already checked in and out for today",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get today's attendance status for the logged-in employee
exports.getTodayAttendance = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: today,
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
