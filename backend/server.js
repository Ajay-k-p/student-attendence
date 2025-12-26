require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Register models
require("./models/Student");
require("./models/Attendance");

const app = express();

// ===============================
// ✅ CORS CONFIG (FINAL & SAFE)
// ===============================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://192.168.1.58:3000",
  "https://student-attendence-kappa.vercel.app", // ✅ NO slash
  process.env.FRONTEND_URL
].filter(Boolean); // removes undefined

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman / server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ Blocked by CORS:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// ===============================
// ✅ MIDDLEWARE (ORDER MATTERS)
// ===============================
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ preflight fix
app.use(express.json());

// ===============================
// DATABASE
// ===============================
connectDB();

// ===============================
// ROUTES
// ===============================
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("Attendance System API is running...");
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
