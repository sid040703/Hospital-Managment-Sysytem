// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import DoctorList from "./components/DoctorManagement/DoctorList";
import DoctorAdd from "./components/DoctorManagement/DoctorAdd";
import DoctorUpdate from "./components/DoctorManagement/DoctorUpdate";
import PatientList from "./components/PatientManagement/PatientList";
import PatientAdd from "./components/PatientManagement/PatientAdd";
import PatientUpdate from "./components/PatientManagement/PatientUpdate";
import WorkerList from "./components/WorkerManagement/WorkerList";
import WorkerAdd from "./components/WorkerManagement/WorkerAdd";
import WorkerUpdate from "./components/WorkerManagement/WorkerUpdate";
import BillingList from "./components/Billing/BillingList";
import BillingAdd from "./components/Billing/BillingAdd";
import QRCodeTransaction from "./components/QrCodeTransaction";
import Appointments from "./components/Appointments";
import PieChart from "./components/Visualizations/PieChart";
import BarChart from "./components/Visualizations/BarChart";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/add-doctor" element={<DoctorAdd />} />
            <Route path="/doctors/update/:id" element={<DoctorUpdate />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/add" element={<PatientAdd />} />
            <Route path="/patients/update/:id" element={<PatientUpdate />} />
            <Route path="/workers" element={<WorkerList />} />
            <Route path="/workers/add" element={<WorkerAdd />} />
            <Route path="/workers/update/:id" element={<WorkerUpdate />} />
            <Route path="/billing" element={<BillingList />} />
            <Route path="/billing/add" element={<BillingAdd />} />
            <Route path="/transactions" element={<QRCodeTransaction />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/charts/pie" element={<PieChart />} />
            <Route path="/charts/bar" element={<BarChart />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
