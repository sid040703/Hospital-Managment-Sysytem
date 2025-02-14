import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./WorkerManagement.css";

function WorkerUpdate() {
  const { id } = useParams(); // Get worker ID from URL
  const navigate = useNavigate();
  const [worker, setWorker] = useState({ name: "", role: "", contact: "", salary: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWorkerDetails();
  }, []);

  // Fetch worker details based on ID
  const fetchWorkerDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/workers/${id}`);
      setWorker(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching worker details:", error);
      setMessage("Failed to load worker details.");
      setLoading(false);
    }
  };

  // Update worker details when input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorker({ ...worker, [name]: value });
  };

  // Submit updated worker data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/workers/${id}`, worker);
      setMessage("Worker updated successfully!");
      setTimeout(() => navigate("/workers"), 1500);
    } catch (error) {
      console.error("Error updating worker:", error);
      setMessage("Failed to update worker.");
    }
  };

  return (
    <div className="worker-update">
      <h2>Update Worker Details</h2>

      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={worker.name} onChange={handleInputChange} required />
          <input type="text" name="role" value={worker.role} onChange={handleInputChange} required />
          <input type="text" name="contact" value={worker.contact} onChange={handleInputChange} required />
          <input type="number" name="salary" value={worker.salary} onChange={handleInputChange} required />
          <button type="submit">Update Worker</button>
        </form>
      )}

      <button className="back-btn" onClick={() => navigate("/workers")}>⬅ Back to List</button>
    </div>
  );
}

export default WorkerUpdate;
