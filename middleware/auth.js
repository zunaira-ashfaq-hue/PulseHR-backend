const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "No authorization header found",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }


    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Find employee
    const employee = await Employee.findById(decoded.id)
      .select("-password");


    if (!employee) {
      return res.status(401).json({
        message: "Employee not found",
      });
    }


    // Add employee to request
    req.employee = employee;

    next();


  } catch (error) {

    console.log("JWT Error:", error.message);

    return res.status(401).json({
      message: "Token is not valid",
      error: error.message,
    });

  }
};



const isAdmin = (req, res, next) => {

  if (req.employee.role !== "admin") {

    return res.status(403).json({
      message: "Access denied. Admin only.",
    });

  }

  next();
};



module.exports = {
  auth,
  isAdmin,
};