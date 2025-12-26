require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Require models to register them with mongoose
require("./models/Student");
require("./models/Attendance");

const app = express();

// ✅ ALLOWED FRONTEND ORIGINS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://student-attendence-kappa.vercel.app/",
  "http://192.168.1.58:3000"
];

// ✅ CORS CONFIG (FIXED)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ PRE-FLIGHT SUPPORT
app.options("*", cors());

// Middleware
app.use(express.json());

// Database
const startServer = async () => {
  try {
    await connectDB();
    // Routes
    app.use("/api/students", studentRoutes);
    app.use("/api/attendance", attendanceRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
