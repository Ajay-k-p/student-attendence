import React, { useState } from 'react';
import AddStudent from '../components/AddStudent';
import AttendanceMark from '../components/AttendanceMark';
import DailyReport from '../components/DailyReport';
import MonthlyReport from '../components/MonthlyReport';

const Dashboard = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="container">
            <h1>🎓 Student Attendance Tracker</h1>
            
            {/* Top Grid: Add Student & Daily Report */}
            <div className="dashboard-grid">
                <AddStudent refreshList={handleRefresh} />
                <DailyReport />
            </div>

            {/* Attendance Marking Section */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <AttendanceMark refreshTrigger={refreshKey} />
            </div>

            {/* Monthly Report Section */}
            <div className="card">
                <MonthlyReport />
            </div>
        </div>
    );
};

export default Dashboard;