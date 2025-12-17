import React, { useState, useEffect } from 'react';
import { fetchStudents, markAttendance, getDailyReport } from '../services/api';

const AttendanceMark = ({ refreshTrigger }) => {
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [statusMap, setStatusMap] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => { loadStudents(); }, [refreshTrigger]);
    useEffect(() => { if(students.length > 0) checkExistingAttendance(); }, [date, students]);

    const loadStudents = async () => {
        try { 
            const { data } = await fetchStudents(); 
            // FIX: Sort students numerically by Roll No (1, 2, 3... 10)
            const sortedData = data.sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo));
            setStudents(sortedData); 
        } 
        catch (error) { console.error(error); }
    };

    const checkExistingAttendance = async () => {
        try {
            const { data } = await getDailyReport(date);
            if (data && data.length > 0) {
                const existingMap = {};
                data.forEach(record => existingMap[record.studentId._id] = record.status);
                setStatusMap(existingMap);
                setIsSubmitted(true);
            } else {
                setStatusMap({});
                setIsSubmitted(false);
            }
        } catch (error) { console.error(error); }
    };

    const handleMark = (studentId, status) => {
        if (isSubmitted) return;
        setStatusMap(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        if (isSubmitted) return;
        const studentIds = Object.keys(statusMap);
        if (studentIds.length === 0) return alert("Please mark attendance first.");
        
        try {
            for (const studentId of studentIds) {
                await markAttendance({ studentId, date, status: statusMap[studentId] });
            }
            alert("Attendance Submitted!");
            setIsSubmitted(true);
        } catch (error) { alert("Submission Failed"); }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>Mark Attendance</h2>
                {isSubmitted && <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠ Already Submitted</span>}
            </div>

            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.rollNo}</td>
                                <td>{student.name}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className={`btn-sm ${statusMap[student._id] === 'Present' ? 'btn-success' : ''}`}
                                            style={{ background: statusMap[student._id] === 'Present' ? '' : '#e5e7eb', color: statusMap[student._id] === 'Present' ? '' : '#374151' }}
                                            onClick={() => handleMark(student._id, 'Present')}
                                            disabled={isSubmitted}
                                        >Present</button>
                                        
                                        <button 
                                            className={`btn-sm ${statusMap[student._id] === 'Absent' ? 'btn-danger' : ''}`}
                                            style={{ background: statusMap[student._id] === 'Absent' ? '' : '#e5e7eb', color: statusMap[student._id] === 'Absent' ? '' : '#374151' }}
                                            onClick={() => handleMark(student._id, 'Absent')}
                                            disabled={isSubmitted}
                                        >Absent</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={isSubmitted} 
                className="btn-primary" 
                style={{ marginTop: '20px', padding: '15px' }}
            >
                {isSubmitted ? "Submitted (Locked)" : "Submit Attendance"}
            </button>
        </div>
    );
};

export default AttendanceMark;