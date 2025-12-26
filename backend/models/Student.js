const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    // ⚠️ THIS LINE KEEPS DATA SAFE FOR REPORTS EVEN AFTER DELETION:
    isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', StudentSchema);