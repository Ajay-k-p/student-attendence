import React, { useState, useEffect } from 'react';
import { fetchStudents, updateStudent, deleteStudent } from '../services/api';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', rollNo: '' });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await fetchStudents();
            setStudents(response.data);
        } catch (error) {
            alert('Error loading students: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (student) => {
        setEditing(student._id);
        setEditForm({ name: student.name, rollNo: student.rollNo });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateStudent(editing, editForm);
            setEditing(null);
            loadStudents();
            alert('Student updated successfully');
        } catch (error) {
            alert('Error updating student: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await deleteStudent(id);
                loadStudents();
                alert('Student deleted successfully');
            } catch (error) {
                alert('Error deleting student: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
            <h3>Student List</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {students.map(student => (
                    <li key={student._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee' }}>
                        {editing === student._id ? (
                            <form onSubmit={handleUpdate}>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    value={editForm.rollNo}
                                    onChange={(e) => setEditForm({ ...editForm, rollNo: e.target.value })}
                                    required
                                />
                                <button type="submit">Update</button>
                                <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                            </form>
                        ) : (
                            <div>
                                <span>{student.name} - {student.rollNo}</span>
                                <button onClick={() => handleEdit(student)}>Edit</button>
                                <button onClick={() => handleDelete(student._id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentList;
