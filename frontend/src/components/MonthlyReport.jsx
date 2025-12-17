import React, { useState } from 'react';
import { getMonthlyReport } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MonthlyReport = () => {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMonthlyReport = async () => {
        setLoading(true);
        try {
            const { data } = await getMonthlyReport(month);
            
            // --- STEP 1: REMOVE BROKEN ROWS ---
            // This removes records where the Name is missing (The "Old Data" rows).
            // Valid "Soft Deleted" students WILL still show up because they still have names.
            const cleanData = data.filter(student => student.name && student.rollNo);

            // --- STEP 2: SORT ---
            // Sort numerically by Roll No
            const sortedData = cleanData.sort((a, b) => {
                const rollA = parseInt(a.rollNo); 
                const rollB = parseInt(b.rollNo);
                return rollA - rollB;
            });
            
            setReport(sortedData);
        } catch (error) {
            console.error("Error fetching report:", error);
            alert("Failed to fetch report");
        }
        setLoading(false);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text(`Monthly Attendance Report: ${month}`, 14, 10);

        const tableColumn = ["Roll No", "Name", "Total Days", "Present", "Absent", "Percentage"];
        const tableRows = [];

        report.forEach(student => {
            const rowData = [
                student.rollNo,
                student.name,
                student.totalDays,
                student.presentDays,
                student.absentDays,
                `${student.percentage.toFixed(2)}%`
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10, halign: 'center' },
            headStyles: { fillColor: [37, 99, 235] }
        });

        doc.save(`Monthly_Report_${month}.pdf`);
    };

    return (
        <div className="card">
            <h3>Monthly Attendance Report</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input 
                    type="month" 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)} 
                    style={{ marginBottom: 0 }}
                />
                <button 
                    onClick={fetchMonthlyReport} 
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: 'auto', whiteSpace: 'nowrap' }}
                >
                    {loading ? 'Loading...' : 'Generate Report'}
                </button>
            </div>

            {report.length > 0 ? (
                <div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    <th>Total Days</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.rollNo}</td>
                                        <td>{student.name}</td>
                                        <td>{student.totalDays}</td>
                                        <td style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
                                            {student.presentDays}
                                        </td>
                                        <td style={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>
                                            {student.absentDays}
                                        </td>
                                        <td style={{ fontWeight: 'bold' }}>
                                            {student.percentage.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button onClick={downloadPDF} className="btn-download">
                        Download Monthly Report PDF
                    </button>
                </div>
            ) : (
                <p style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '10px' }}>
                    {loading ? "Generating Report..." : "No data found for this month."}
                </p>
            )}
        </div>
    );
};

export default MonthlyReport;