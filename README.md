# Employee Management System - Backend

A simple and efficient Employee Management System backend built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access (Employee & Admin)
  
- **Employee Management**
  - Add, view, update, and delete employees
  - Employee profiles with department and position info
  
- **Attendance Management**
  - Mark daily attendance
  - View attendance history
  - Track check-in/check-out times
  
- **Leave Management**
  - Apply for leave (sick, casual, vacation)
  - Approve/reject leave requests (Admin)
  - View leave history
  
- **Dashboard**
  - Total employee count
  - Employees by department
  - Leave statistics
  - Daily attendance summary

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee-system
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

3. Make sure MongoDB is running locally or update the connection string

4. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new employee
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (protected)

### Employees (Admin only for most operations)
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `POST /api/attendance` - Mark attendance (Admin)
- `GET /api/attendance/employee/:employeeId` - Get attendance by employee
- `GET /api/attendance` - Get all attendance records (Admin)
- `PUT /api/attendance/:id` - Update attendance (Admin)

### Leave
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/employee/:employeeId` - Get leaves by employee
- `GET /api/leaves` - Get all leave requests (Admin)
- `PUT /api/leaves/:id` - Update leave status (Admin)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics (Admin)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
