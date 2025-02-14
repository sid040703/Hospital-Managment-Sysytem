import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

import "./QRCodeTransaction.css";

function QRCodeTransaction() {
  const [amount, setAmount] = useState("");
  const [qrData, setQrData] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQRCode = async () => {
    setError("");
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      // Send the amount to the backend and receive the transaction ID
      const response = await axios.post("http://127.0.0.1:5000/api/payment", { amount });

      // Set the QR data to include the unique transaction ID
      const transactionID = response.data.transactionId;
      setTransactionId(transactionID);

      setQrData(`Payment for Hospital - Amount: Rs${amount} - Transaction ID: ${transactionID}`);
    } catch (error) {
      console.error("Error generating payment:", error);
      setError("Failed to generate QR Code. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="qr-transaction">
      <h2>QR Code for Payment</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
      />
      <button onClick={generateQRCode} disabled={loading}>
        {loading ? "Generating..." : "Generate QR Code"}
      </button>

      {qrData && (
        <div className="qr-code">
          <QRCodeCanvas value={qrData} size={200} />
          <p>Transaction ID: {transactionId}</p>
        </div>
      )}
    </div>
  );
}

export default QRCodeTransaction;
