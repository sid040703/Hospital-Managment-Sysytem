import React from "react";

function LinePlot() {
  return (
    <div style={{ width: "60%", margin: "auto", textAlign: "center" }}>
      <h2>Hospital Revenue Trend</h2>
      <img
        src="http://127.0.0.1:5000/api/charts/revenue-trend"
        alt="Revenue Trend"
        style={{ width: "100%", maxHeight: "400px" }}
      />
    </div>
  );
}

export default LinePlot;
