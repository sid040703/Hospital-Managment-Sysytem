import React, { useState } from "react";
import axios from "axios"; // Import Axios
import "./WorkerManagement.css";

function WorkerAdd() {
  const [worker, setWorker] = useState({
    name: "",
    role: "",
    contact: "",
    salary: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setWorker({ ...worker, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send worker data to the backend API using Axios
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/workers", worker);

      if (response.status === 201) {
        setSuccessMessage("Worker successfully added!");
        setWorker({ name: "", role: "", contact: "", salary: "" });
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the worker.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="worker-form-container">
      <h2>Add Worker</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Worker Name"
          value={worker.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role (e.g., Nurse, Janitor)"
          value={worker.role}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={worker.contact}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary ($)"
          value={worker.salary}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Worker</button>
      </form>
    </div>
  );
}

export default WorkerAdd;
