import React, { useState } from 'react';
import { getDailyReport } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DailyReport = () => {
    const [date, setDate] = useState('');
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        if (!date) {
            alert("Please select a date first");
            return;
        }
        setLoading(true);
        try {
            const { data } = await getDailyReport(date);

            // --- STEP 1: REMOVE BROKEN ROWS ---
            // Only keep records where studentId exists and has a name & rollNo
            const cleanData = data.filter(record => 
                record.studentId && record.studentId.name && record.studentId.rollNo
            );

            // --- STEP 2: SORT NUMERICALLY ---
            const sortedData = cleanData.sort((a, b) => {
                const rollA = parseInt(a.studentId.rollNo); 
                const rollB = parseInt(b.studentId.rollNo);
                return rollA - rollB;
            });

            setReport(sortedData);
        } catch (error) {
            console.error("Error fetching report:", error);
            alert("Failed to fetch report");
        }
        setLoading(false);
    };

    // --- PDF Download Function ---
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text(`Daily Attendance Report: ${date}`, 14, 10);

        const tableColumn = ["Roll No", "Student Name", "Status"];
        const tableRows = [];

        report.forEach(record => {
            const rowData = [
                record.studentId.rollNo, // Data is guaranteed to exist now
                record.studentId.name,
                record.status
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            headStyles: { fillColor: [37, 99, 235] } // Matches our Primary Blue
        });

        doc.save(`Attendance_Report_${date}.pdf`);
    };

    return (
        <div className="card">
            <h3>Daily Report</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input 
                    type="date" 
                    onChange={(e) => setDate(e.target.value)} 
                    style={{ marginBottom: 0 }} 
                />
                <button 
                    onClick={fetchReport} 
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: 'auto', whiteSpace: 'nowrap' }}
                >
                    {loading ? "Loading..." : "Get Report"}
                </button>
            </div>

            {report.length > 0 ? (
                <div>
                    {/* Responsive Table Wrapper */}
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
                                {report.map((record) => (
                                    <tr key={record._id}>
                                        <td>{record.studentId.rollNo}</td>
                                        <td>{record.studentId.name}</td>
                                        <td>
                                            <span className={record.status === 'Present' ? 'status-present' : 'status-absent'}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button 
                        onClick={downloadPDF}
                        className="btn-download"
                    >
                        Download PDF
                    </button>
                </div>
            ) : (
                <p style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '10px' }}>
                    {date ? "No records found for this date." : "Select a date to view report."}
                </p>
            )}
        </div>
    );
};

export default DailyReport;