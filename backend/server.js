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
  "https://student-attendence-kappa.vercel.app"
];

// ✅ CORS CONFIG (IMPORTANT)
app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools like Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ HANDLE PREFLIGHT REQUESTS
app.options("*", cors());

// Middleware
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
