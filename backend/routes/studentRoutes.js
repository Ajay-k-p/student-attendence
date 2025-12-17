const express = require('express');
const { addStudent, getAllStudents, deleteStudent, updateStudent } = require('../controllers/studentController');
const router = express.Router();

router.post('/', addStudent);
router.get('/', getAllStudents);
router.delete('/:id', deleteStudent); // New
router.put('/:id', updateStudent);    // New

module.exports = router;