import React, { useState, useEffect } from 'react';
import Chart from './Chart';

const Dashboard = ({ containerStyle, onClickDashboardItem, dashboardName }) => {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    // Inside the effect, perform the API call
    fetch(`https://quill-backend-api.vercel.app/api/charts/${dashboardName}`)
      .then(response => response.json())
      .then(data => {
        // Casting the data and configuration for each chart
        const castedCharts = data.map(item => ({
          id: item.config.id,
          title: item.config.name,
          chartType: item.config.chartType,
          xAxisField: item.config.xAxisField,
          yAxisField: item.config.yAxisField,
          data: item.data.map(dataItem => ({
            ...dataItem,
            [item.config.yAxisField]: parseFloat(dataItem[item.config.yAxisField])
          }))
        }));
        setCharts(castedCharts);
      })
      .catch(error => console.error('Error fetching charts:', error));
  }, [dashboardName]); // Ensure the effect runs when dashboardName changes

  return (
    <div style={containerStyle}>
      <h2>{dashboardName}</h2>
      <div className="chart-grid">
        {charts.map(chart => (
          <Chart key={chart.id} chart={chart} onClick={() => onClickDashboardItem(chart)} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
