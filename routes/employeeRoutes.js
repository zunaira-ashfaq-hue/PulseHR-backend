const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/', auth, isAdmin, employeeController.getAllEmployees);
router.get('/:id', auth, employeeController.getEmployeeById);
router.post('/', auth, isAdmin, employeeController.createEmployee);
router.put('/:id', auth, isAdmin, employeeController.updateEmployee);
router.delete('/:id', auth, isAdmin, employeeController.deleteEmployee);

module.exports = router;
