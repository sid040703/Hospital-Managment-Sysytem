import React, { useState, useEffect } from "react";

function PieChart() {
  const [chartUrl, setChartUrl] = useState("http://127.0.0.1:5000/api/charts/department-distribution");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await fetch(chartUrl, { method: "GET" });
        if (!response.ok) throw new Error("Failed to load chart");
      } catch (err) {
        setError("Error loading the pie chart. Please check the backend.");
      }
    };
    fetchChart();
  }, [chartUrl]);

  return (
    <div style={{ width: "60%", margin: "auto", textAlign: "center" }}>
      <h2>Department Distribution</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <img
          src={chartUrl}
          alt="Department Distribution"
          style={{ width: "100%", maxHeight: "400px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
}

export default PieChart;
