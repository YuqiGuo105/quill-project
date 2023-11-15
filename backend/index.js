const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // If you are using dotenv to manage environment variables

const app = express();
app.use(express.json());

const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: '*', // Allows all origins
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));

app.use(function (_, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// Database connection setup
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db.drskhkvlgrdeemligzdd.supabase.co',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || '****',
  port: process.env.DB_PORT || 5432,
});

// Add a root route handler
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to fetch dashboard data by name
app.get('/api/dashboard/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const dashboardQuery = await pool.query('SELECT * FROM Dashboard WHERE name = $1', [name]);
    const dashboard = dashboardQuery.rows;

    if (dashboard.length > 0) {
      res.json(dashboard);
    } else {
      res.status(404).send('Dashboard not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Route to fetch a specific chart by ID
app.get('/api/chart/:id', async (req, res) => {
  try {
    const { config, data } = await getChartConfigAndData(req.params.id);
    res.json({ config, data });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Endpoint to fetch all charts for a specific dashboard by name
app.get('/api/charts/:dashboardName', async (req, res) => {
  try {
    const { dashboardName } = req.params;

    // Query to get all chart IDs associated with the dashboardName
    const chartsData = await pool.query('SELECT id FROM Chart WHERE "dashboardName" = $1', [dashboardName]);

    if (chartsData.rows.length === 0) {
        return res.status(404).json({ message: "No charts found for the specified dashboard" });
    }

    // Fetch configuration and data for each chart
    const chartsWithConfigAndData = await Promise.all(chartsData.rows.map(async (chart) => {
        return getChartConfigAndData(chart.id);
    }));

    res.json(chartsWithConfigAndData);
} catch (err) {
    res.status(500).send(err.message);
}
});

// Route to fetch a specific chart configuration and data by ID
async function getChartConfigAndData(chartId) {
  try {
    const chartQuery = await pool.query('SELECT * FROM Chart WHERE id = $1', [chartId]);
    const chart = chartQuery.rows[0];

    if (!chart) {
      throw new Error(`No chart found with ID: ${chartId}`);
    }

    // Retrieve chart data using the SQL query
    const dataQuery = chart.sqlQuery && chart.sqlQuery.trim() !== '' ? await pool.query(chart.sqlQuery) : { rows: [] };

    return {
      config: {
        name: chart.name,
        id: chart.id,
        dashboardName: chart.dashboardName,
        chartType: chart.chartType,
        sqlQuery: chart.sqlQuery,
        xAxisField: chart.xAxisField,
        yAxisField: chart.yAxisField,
      },
      data: dataQuery.rows
    };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
