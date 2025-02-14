import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BillingList.css";

function BillingList() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch billing data from the backend
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/billing");
        setBills(response.data); // Set the fetched bills into state
      } catch (error) {
        console.error("Error fetching billing records:", error);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="billing-list-container">
      <h2>Billing Records</h2>

      <input
        type="text"
        placeholder="Search by Patient Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Treatment</th>
            <th>Amount (Rs)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bills
            .filter((bill) =>
              bill.patient_name.toLowerCase().includes(search.toLowerCase())
            )
            .map((bill, index) => (
              <tr key={index}>
                <td>{bill.patient_name}</td>
                <td>{bill.treatment}</td>
                <td>Rs {bill.amount}</td>
                <td>{bill.date}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {bills.length === 0 && <p>No billing records available.</p>}
    </div>
  );
}

export default BillingList;
