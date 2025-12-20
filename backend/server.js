require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

// ✅ ALLOWED FRONTEND ORIGINS
const allowedOrigins = [
  "http://localhost:3000",
<<<<<<< HEAD
  "https://student-attendence-kappa.vercel.app/"
=======
  "https://student-attendance-kappa.vercel.app/"
>>>>>>> aeebdfe (Fix CORS and finalize production URLs)
];

// ✅ CORS OPTIONS
const corsOptions = {
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
};

// ✅ CORS CONFIG
app.use(cors(corsOptions));

// ✅ PRE-FLIGHT SUPPORT
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
