require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

// ✅ CORS FIX FOR VERCEL
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://student-attendance-kappa.vercel.app" // 👈 YOUR VERCEL URL
  ], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
