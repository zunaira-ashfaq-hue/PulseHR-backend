const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

exports.register = async (req, res) => {
  console.log("========== Register API Hit ==========");
  console.log("Request Body:", req.body);

  try {
    const { name, email, password, role, department, position, phone } = req.body;

    console.log("Checking existing employee...");

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      console.log("Employee already exists");
      return res.status(400).json({ message: "Employee already exists" });
    }

    console.log("Creating new employee...");

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

    console.log("Employee saved successfully");

    const token = jwt.sign(
      { id: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Employee registered successfully",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position
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
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position
      }
    });

  } catch (error) {
    console.error(error);
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