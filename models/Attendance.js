const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-day"],
      required: true,
    },
    checkIn: {
      type: String,
    },
    checkOut: {
      type: String,
    },
    notes: {
      type: String,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Attendance", attendanceSchema);
