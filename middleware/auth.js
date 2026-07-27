const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const auth = async (req, res, next) => {
  try {

    const authHeader = req.header("Authorization");

    console.log("AUTH HEADER:", authHeader);
    console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);


    if (!authHeader) {
      return res.status(401).json({
        message: "No authorization header found",
      });
    }


    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    console.log("DECODED:", decoded);


    const employee = await Employee.findById(decoded.id)
      .select("-password");


    console.log("EMPLOYEE:", employee);


    if (!employee) {
      return res.status(401).json({
        message: "Employee not found",
      });
    }


    req.employee = employee;

    next();


  } catch(error){

    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: error.message
    });

  }
};


const isAdmin = (req,res,next)=>{

  if(req.employee.role !== "admin"){
    return res.status(403).json({
      message:"Admin only"
    });
  }

  next();
};


module.exports = {
  auth,
  isAdmin
};