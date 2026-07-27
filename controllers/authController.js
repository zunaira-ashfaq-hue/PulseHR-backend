const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

exports.register = async (req, res) => {
  console.log("========== Register API Hit ==========");
  console.log("Request Body:", req.body);

  try {
    const { name, email, password, role, department, position, phone } = req.body;

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const employee = new Employee({
      name,
      email,
      password,
      role,
      department,
      position,
      phone
    });

    await employee.save();

    const token = jwt.sign(
      { id: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Employee registered successfully",
      token,
      employee: {
        _id: employee._id,
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position,
        phone: employee.phone
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await employee.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      employee: {
        _id: employee._id,
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position,
        phone: employee.phone
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getProfile = async (req, res) => {
  try {
    res.json(req.employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};