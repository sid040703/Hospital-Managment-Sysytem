import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Appointments.css";

function Appointments() {
  const [appointment, setAppointment] = useState({
    patientName: "",
    doctor: "",
    date: "",
    time: ""
  });
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors from the backend
  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/doctors");
      setDoctors(response.data); // Assuming backend returns a list of doctors
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/appointments", appointment);
      console.log("Appointment booked successfully:", response.data);
      setAppointment({
        patientName: "",
        doctor: "",
        date: "",
        time: ""
      });
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="appointments">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={appointment.patientName}
          onChange={handleChange}
          required
        />
        <select
          name="doctor"
          value={appointment.doctor}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.name}>
              {doctor.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={appointment.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={appointment.time}
          onChange={handleChange}
          required
        />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default Appointments;
