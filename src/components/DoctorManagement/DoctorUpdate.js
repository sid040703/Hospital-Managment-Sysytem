import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import './DoctorManagement.css'; // Add the CSS file for styling

function DoctorUpdate() {
  const { id } = useParams(); // Access the dynamic id from the URL
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    contact: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate to redirect after update

  useEffect(() => {
    // Fetch doctor details based on the id
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/doctors/${id}`);
        setDoctor(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        setError("Failed to load doctor details");
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  // Handle form submission to update doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Submitting the following doctor data: ", doctor); // Log doctor data
  
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/doctors/${id}`,
        doctor
      );
  
      if (response.status === 200) {
        navigate("/doctors");
      } else {
        setError("Failed to update doctor details. Please try again.");
      }
    } catch (error) {
      setError("Error updating doctor details.");
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="update-doctor-container">
      <h2>Update Doctor</h2>

      {loading && <p>Loading doctor details...</p>}
      {error && <p className="error">{error}</p>}

      {doctor && !loading && (
        <form onSubmit={handleSubmit} className="doctor-update-form">
          <div>
            <label>Doctor Name</label>
            <input
              type="text"
              value={doctor.name}
              onChange={(e) =>
                setDoctor({ ...doctor, name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Specialization</label>
            <input
              type="text"
              value={doctor.specialization}
              onChange={(e) =>
                setDoctor({ ...doctor, specialization: e.target.value })
              }
            />
          </div>
          <div>
            <label>Contact Number</label>
            <input
              type="text"
              value={doctor.contact}
              onChange={(e) =>
                setDoctor({ ...doctor, contact: e.target.value })
              }
            />
          </div>
          <div>
            <label>Email Address</label>
            <input
              type="email"
              value={doctor.email}
              onChange={(e) =>
                setDoctor({ ...doctor, email: e.target.value })
              }
            />
          </div>

          <button type="submit" className="update-button">Update Doctor</button>
        </form>
      )}
    </div>
  );
}

export default DoctorUpdate;
