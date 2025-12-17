import axios from 'axios';

const API = axios.create({ baseURL: "https://student-attendance-backend.onrender.com/api" });

// Student Routes
export const fetchStudents = () => API.get('/students');
export const addStudent = (data) => API.post('/students', data);

// Attendance Routes
export const markAttendance = (data) => API.post('/attendance', data);

// ⚠️ THIS LINE WAS CAUSING THE ERROR
// It must include '/daily/' to match the backend
export const getDailyReport = (date) => API.get(`/attendance/daily/${date}`);

export const getMonthlyReport = (month) => API.get(`/attendance/monthly/${month}`);

// ... existing imports
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);