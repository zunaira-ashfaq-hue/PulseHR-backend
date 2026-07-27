const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const employee = await Employee.findById(decoded.id)
      .select("-password");

    if (!employee) {
      return res.status(401).json({
        message: "Employee not found"
      });
    }

    req.employee = employee;

    next();

  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(401).json({
      message: "Token is not valid"
    });
  }
};


const isAdmin = (req, res, next) => {

  if (!req.employee || req.employee.role !== "admin") {
    return res.status(403).json({
      message: "Admin only"
    });
  }

  next();
};


module.exports = {
  auth,
  isAdmin
};