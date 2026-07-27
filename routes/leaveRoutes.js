const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { auth, isAdmin } = require('../middleware/auth');

router.post('/', auth, leaveController.applyLeave);
router.get('/employee/:employeeId', auth, leaveController.getLeavesByEmployee);
router.get('/', auth, isAdmin, leaveController.getAllLeaves);
router.put('/:id', auth, isAdmin, leaveController.updateLeaveStatus);

module.exports = router;
