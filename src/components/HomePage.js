import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HomePage.css"; // Ensure you have a CSS file for styling

function HomePage() {
  const [dataCounts, setDataCounts] = useState({
    doctors: 0,
    patients: 0,
    workers: 0,
    bills: 0,
  });

  // Fetch counts from the backend
  const fetchCounts = async () => {
    try {
      const doctorCount = await axios.get("http://127.0.0.1:5000/api/doctors");
      const patientCount = await axios.get("http://127.0.0.1:5000/api/patients/count");
      const workerCount = await axios.get("http://127.0.0.1:5000/api/workers/count");
      const billCount = await axios.get("http://127.0.0.1:5000/api/billing/count");

      setDataCounts({
        doctors: doctorCount.data.count,
        patients: patientCount.data.count,
        workers: workerCount.data.count,
        bills: billCount.data.count,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="home-container">
      <div className="welcome-message">
        <h1>Welcome to the Hospital Management System</h1>
        <p>Manage your hospital operations with ease.</p>
      </div>
      <div className="card-container">
        <div className="card">
          <h3>Doctors Management</h3>
          <p>View, Add, and Manage Doctors</p>
          <p>Doctors: {dataCounts.doctors}</p>
          <Link to="/doctors">
            <button className="card-button">Manage Doctors</button>
          </Link>
        </div>
        <div className="card">
          <h3>Patients Management</h3>
          <p>View, Add, and Manage Patients</p>
          <p>Patients: {dataCounts.patients}</p>
          <Link to="/patients">
            <button className="card-button">Manage Patients</button>
          </Link>
        </div>
        <div className="card">
          <h3>Billing Management</h3>
          <p>Generate Bills and View Transactions</p>
          <p>Bills: {dataCounts.bills}</p>
          <Link to="/billing">
            <button className="card-button">Manage Billing</button>
          </Link>
        </div>
        <div className="card">
          <h3>Worker Management</h3>
          <p>Manage Hospital Staff</p>
          <p>Workers: {dataCounts.workers}</p>
          <Link to="/workers">
            <button className="card-button">Manage Workers</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
