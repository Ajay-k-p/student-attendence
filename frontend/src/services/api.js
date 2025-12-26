import axios from "axios";

<<<<<<< HEAD
const API = axios.create({ baseURL: "http://localhost:5000/api" });
=======
// ===============================
// AXIOS INSTANCE
// ===============================
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});
>>>>>>> d800edc1db69cdcd0a304279a9a37860496d48ba

// ===============================
// STUDENT ROUTES
// ===============================
export const fetchStudents = () => API.get("/students");
export const addStudent = (data) => API.post("/students", data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);

// ===============================
// ATTENDANCE ROUTES
// ===============================
export const markAttendance = (data) => API.post("/attendance", data);
export const getDailyReport = (date) =>
  API.get(`/attendance/daily/${date}`);
export const getMonthlyReport = (month) =>
  API.get(`/attendance/monthly/${month}`);

export default API;
