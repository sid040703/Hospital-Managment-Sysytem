import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed
import "./DoctorManagement.css";

function DoctorAdd() {
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    contact: "",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/doctors", doctor, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setMessage("Doctor added successfully!");
        setMessageType("success");
        setDoctor({ name: "", specialization: "", contact: "", email: "" }); // Clear form after success
      } else {
        setMessage("Unexpected error. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      // Handle backend errors
      if (error.response) {
        setMessage(error.response.data.message || "Failed to add doctor.");
      } else {
        setMessage("Server error. Please check the backend.");
      }
      setMessageType("error");
    }

    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="doctor-form-container">
      <h2>Add New Doctor</h2>

      {message && (
        <p className={`message ${messageType === "success" ? "success-message" : "error-message"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Doctor Name"
          value={doctor.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={doctor.specialization}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={doctor.contact}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={doctor.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
}

export default DoctorAdd;
