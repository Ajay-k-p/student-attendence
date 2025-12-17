const express = require('express');
const { 
    markAttendance, 
    getDailyReport, 
    getMonthlyReport 
} = require('../controllers/attendanceController');

const router = express.Router();

// Route: POST /api/attendance
router.post('/', markAttendance);

// Route: GET /api/attendance/daily/2023-10-25
router.get('/daily/:date', getDailyReport);

// Route: GET /api/attendance/monthly/2023-10
router.get('/monthly/:month', getMonthlyReport);

module.exports = router;