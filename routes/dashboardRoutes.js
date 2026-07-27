const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/', auth, isAdmin, dashboardController.getDashboardStats);

module.exports = router;
