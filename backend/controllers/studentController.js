const Student = require('../models/Student');

// 1. Add New Student
exports.addStudent = async (req, res) => {
    try {
        const { name, rollNo } = req.body;
        const newStudent = new Student({ name, rollNo });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get All Students (Filtered: Hides "Soft Deleted" students)
exports.getAllStudents = async (req, res) => {
    try {
        // This ensures deleted students don't show up in the attendance list
        const students = await Student.find({ isDeleted: { $ne: true } });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Update Student
exports.updateStudent = async (req, res) => {
    try {
        const { name, rollNo } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, rollNo },
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Delete Student (Soft Delete Logic)
// CRITICAL: We update 'isDeleted' to true instead of removing the record.
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true }, 
            { new: true }
        );
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json({ message: 'Student deleted (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};