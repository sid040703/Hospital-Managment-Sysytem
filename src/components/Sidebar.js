// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Hospital Management</h2>
      <ul>
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/doctors">👨‍⚕️ Doctors</Link></li>
        <li><Link to="/patients">🧑‍🤝‍🧑 Patients</Link></li>
        <li><Link to="/workers">👷 Workers</Link></li>
        <li><Link to="/billing">💰 Billing</Link></li>
        <li><Link to="/transactions">🔗 QR Transactions</Link></li>
        <li><Link to="/appointments">📅 Appointments</Link></li>
        <li><Link to="/charts/pie">📊 Pie Chart</Link></li>
        <li><Link to="/charts/bar">📈 Bar Chart</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
