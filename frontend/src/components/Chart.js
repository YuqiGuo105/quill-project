import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Chart = ({ chart }) => {
  // Parsing data
  const parsedData = chart.data.map(item => ({
    ...item,
    [chart.yAxisField]: parseFloat(item[chart.yAxisField])
  }));

  // Determine chart type and render accordingly
  const renderChart = () => {
    switch (chart.chartType) {
      case 'line':
        return (
          <LineChart width={600} height={300} data={parsedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chart.xAxisField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={chart.yAxisField} stroke="#8884d8" />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart width={600} height={300} data={parsedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chart.xAxisField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={chart.yAxisField} fill="#8884d8" />
          </BarChart>
        );
      default:
        return <p>Chart type not supported</p>;
    }
  };

  return (
    <div className="chart-item">
      <h3>{chart.title}</h3>
      {renderChart()}
    </div>
  );
};

export default Chart;
