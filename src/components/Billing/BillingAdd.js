// src/components/Billing/BillingAdd.js
import React, { useState } from "react";
import axios from "axios";
import "./BillingAdd.css";

function BillingAdd() {
  const [bill, setBill] = useState({
    patientName: "",
    treatment: "",
    amount: "",
    date: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill({ ...bill, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!bill.patientName || !bill.treatment || !bill.amount || !bill.date) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/billing", bill, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensures cookies are sent if required
      });

      console.log("Billing details submitted:", response.data);
      setMessage("Billing details added successfully!");

      // Clear form after successful submission
      setBill({ patientName: "", treatment: "", amount: "", date: "" });
    } catch (error) {
      console.error("Error adding billing details:", error);
      setMessage("Failed to add billing details.");
    }
  };

  return (
    <div className="billing-container">
      <h2>Add Billing Details</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={bill.patientName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="treatment"
          placeholder="Treatment Description"
          value={bill.treatment}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount (in $)"
          value={bill.amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={bill.date}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Bill</button>
      </form>
    </div>
  );
}

export default BillingAdd;
