import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientManagement.css";

function PatientUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState({ name: "", age: "", gender: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPatientDetails();
  }, []);

  const fetchPatientDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/patients/${id}`);
      setPatient(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setMessage("Failed to load patient details.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/patients/${id}`, patient);
      setMessage("Patient updated successfully!");
      setTimeout(() => navigate("/patients"), 1500);
    } catch (error) {
      console.error("Error updating patient:", error);
      setMessage("Failed to update patient.");
    }
  };

  return (
    <div className="patient-update">
      <h2>Update Patient Details</h2>

      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={patient.name} onChange={handleInputChange} required />
          <input type="number" name="age" value={patient.age} onChange={handleInputChange} required />
          <select name="gender" value={patient.gender} onChange={handleInputChange} required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="text" name="phone" value={patient.phone} onChange={handleInputChange} required />
          <button type="submit">Update Patient</button>
        </form>
      )}

      <button className="back-btn" onClick={() => navigate("/patients")}>⬅ Back to List</button>
    </div>
  );
}

export default PatientUpdate;
