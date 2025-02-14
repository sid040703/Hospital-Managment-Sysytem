import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './DoctorManagement.css'; // Styling for doctor management pages

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  // Fetch doctors data from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);
  const handleEdit = (workerId) => {
    navigate(`/doctors/update/${workerId}`);
    // You can implement logic here to edit the worker (e.g., open a modal or redirect to an edit page)
  };
  // Handle delete doctor
  const handleDelete = async (id) => {
    try {
      // Send the DELETE request to the backend
      await axios.delete(`http://127.0.0.1:5000/api/doctors/${id}`);
      
      // Update the state to remove the deleted doctor
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor. Please try again.");
    }
  };
  

  return (
    <div className="doctor-list">
      <h2>Doctor List</h2>

      <input
        type="text"
        placeholder="Search by Doctor Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>specialization</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors
            .filter((doctor) =>
              doctor.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.contact}</td>
                <td>{doctor.email}</td>
                <td>
                  <button onClick={() => handleEdit(doctor.id)}>Edit</button>
                  <button onClick={() => handleDelete(doctor.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {doctors.length === 0 && <p>No doctors available.</p>}

      <button className="add-btn" onClick={() => window.location.href = "/add-doctor"}>
        Add New Doctor
      </button>
    </div>
  );
}

export default DoctorList;
