import axios from "axios";

// ===============================
// AXIOS INSTANCE
// ===============================
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

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
