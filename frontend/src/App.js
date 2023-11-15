import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  const containerStyle = {
    padding: '20px',
    margin: '20px',
    border: '1px solid #ddd'
  };

  const onClickDashboardItem = (dashboardItem) => {
    console.log('Clicked on:', dashboardItem);
  };

  const defaultDashboardName = "Sales Dashboard"; // Define the default dashboard name here

  return (
    <div className="App">
      <Dashboard 
        containerStyle={containerStyle} 
        onClickDashboardItem={onClickDashboardItem} 
        dashboardName={defaultDashboardName}  // Passing the default dashboard name as a prop
      />
    </div>
  );
}

export default App;
