const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { auth, isAdmin } = require("../middleware/auth");

// Employee routes - must come before admin routes to avoid conflicts
router.post("/self", auth, attendanceController.markSelfAttendance);
router.get("/today", auth, attendanceController.getTodayAttendance);

// Admin routes
router.post("/", auth, isAdmin, attendanceController.markAttendance);
router.get(
  "/employee/:employeeId",
  auth,
  attendanceController.getAttendanceByEmployee,
);
router.get("/", auth, isAdmin, attendanceController.getAllAttendance);
router.put("/:id", auth, isAdmin, attendanceController.updateAttendance);

module.exports = router;
