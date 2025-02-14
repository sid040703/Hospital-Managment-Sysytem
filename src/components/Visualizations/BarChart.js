import React from "react";

function BarChart() {
  return (
    <div style={{ width: "60%", margin: "auto", textAlign: "center" }}>
      <h2>Hospital Bar Chart</h2>
      <img
        src="http://127.0.0.1:5000/api/charts/hospital-stats"
        alt="Hospital Statistics"
        style={{ width: "100%", maxHeight: "400px" }}
      />
    </div>
  );
}

export default BarChart;
