import React, { useState, useEffect } from 'react';
import { addStudent, fetchStudents, deleteStudent, updateStudent } from '../services/api';

const AddStudent = ({ refreshList }) => {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ name: '', rollNo: '' });
    const [editingId, setEditingId] = useState(null); // Track if we are editing

    // Load students on mount
    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const { data } = await fetchStudents();
            // FIX: Sort numerically here too
            setStudents(data.sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo)));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update Logic
                await updateStudent(editingId, form);
                alert("Student Updated Successfully");
                setEditingId(null);
            } else {
                // Add Logic
                await addStudent(form);
                alert("Student Added Successfully");
            }
            setForm({ name: '', rollNo: '' });
            loadStudents(); // Refresh local list
            if (refreshList) refreshList(); // Refresh parent dashboard
        } catch (error) {
            alert("Operation Failed: " + error.message);
        }
    };

    const handleEdit = (student) => {
        setForm({ name: student.name, rollNo: student.rollNo });
        setEditingId(student._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteStudent(id);
            loadStudents();
            if (refreshList) refreshList();
        }
    };

    return (
        <div className="card">
            <h3>{editingId ? "Edit Student" : "Manage Students"}</h3>
            
            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                <input placeholder="Roll No" value={form.rollNo} onChange={(e) => setForm({...form, rollNo: e.target.value})} required />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-primary">
                        {editingId ? "Update Student" : "Add Student"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', rollNo: '' }); }} style={{ background: '#6b7280', color: 'white' }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Management Table */}
            <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Roll</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.rollNo}</td>
                                <td>{student.name}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(student)} className="btn-sm" style={{ background: '#f59e0b', color: 'white', border: 'none' }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(student._id)} className="btn-sm" style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AddStudent;