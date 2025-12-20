require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

// ===============================
// CORS CONFIG
// ===============================
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight fix
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
