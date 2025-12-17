const Attendance = require('../models/Attendance');

// 1. Mark Attendance (Upsert)
exports.markAttendance = async (req, res) => {
    try {
        const { studentId, date, status } = req.body;
        
        const attendance = await Attendance.findOneAndUpdate(
            { studentId, date },
            { status },
            { new: true, upsert: true }
        );
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get Daily Report
exports.getDailyReport = async (req, res) => {
    try {
        const { date } = req.params;
        const records = await Attendance.find({ date }).populate('studentId');
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Monthly Report (Aggregation) - NEW ADDITION
exports.getMonthlyReport = async (req, res) => {
    try {
        const { month } = req.params; // Expected format: YYYY-MM
        
        const report = await Attendance.aggregate([
            // Filter by month (using regex to match the start of the date string)
            { 
                $match: { 
                    date: { $regex: `^${month}` } 
                } 
            },
            // Group by student and count stats
            {
                $group: {
                    _id: "$studentId",
                    totalDays: { $sum: 1 },
                    presentDays: {
                        $sum: { 
                            $cond: [{ $eq: ["$status", "Present"] }, 1, 0] 
                        }
                    }
                }
            },
            // Join with Student data to get names
            {
                $lookup: {
                    from: "students", // MongoDB collection name is usually lowercase plural
                    localField: "_id",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            // Format the final output
            {
                $project: {
                    name: { $arrayElemAt: ["$studentInfo.name", 0] },
                    rollNo: { $arrayElemAt: ["$studentInfo.rollNo", 0] },
                    totalDays: 1,
                    presentDays: 1,
                    absentDays: { $subtract: ["$totalDays", "$presentDays"] },
                    percentage: { 
                        $multiply: [
                            { $divide: ["$presentDays", "$totalDays"] }, 
                            100 
                        ] 
                    }
                }
            }
        ]);

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};