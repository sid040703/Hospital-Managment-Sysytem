import React, { useState, useEffect } from "react";
import axios from "axios";
import './WorkerManagement.css';
import { useNavigate } from "react-router-dom";

function WorkerList() {
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();

  // Fetch workers data from the backend
  const fetchWorkers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/workers"); // Updated to match backend
      setWorkers(response.data); // Assuming backend returns a list of workers
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  // Handle Delete worker
  const handleDelete = async (workerId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/workers/${workerId}`);
      setWorkers(workers.filter(worker => worker.id !== workerId)); // Remove the deleted worker from the list
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  // Handle Edit worker
  const handleEdit = (workerId) => {
    navigate(`/workers/update/${workerId}`);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div className="worker-list">
      <h2>Worker List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Contact</th>
            <th>Salary (Rs)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workers.length > 0 ? (
            workers.map(worker => (
              <tr key={worker.id}>
                <td>{worker.id}</td>
                <td>{worker.name}</td>
                <td>{worker.role}</td>
                <td>{worker.contact}</td>
                <td>{worker.salary}</td>
                <td>
                  <button onClick={() => handleEdit(worker.id)}>Edit</button>
                  <button onClick={() => handleDelete(worker.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No workers found</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="add-btn" onClick={() => navigate("/workers/add")}>Add New Worker</button>
    </div>
  );
}

export default WorkerList;
