import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './PatientManagement.css';

function PatientAdd() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({ name: "", age: "", gender: "", phone: "" });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/patients", patient);
      console.log(response.data);
      setMessage("Patient added successfully!");

      // Clear the form after successful submission
      setPatient({ name: "", age: "", gender: "", phone: "" });

      // Redirect to patient list
      setTimeout(() => navigate("/patients"), 1000);
    } catch (error) {
      console.error("Error adding patient:", error);
      setMessage("Failed to add patient.");
    }
  };

  return (
    <div className="patient-add">
      <h2>Add New Patient</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Patient's Name"
          value={patient.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={patient.age}
          onChange={handleInputChange}
          required
        />
        <select name="gender" value={patient.gender} onChange={handleInputChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={patient.phone}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}

export default PatientAdd;
