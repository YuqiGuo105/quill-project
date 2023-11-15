# quill-project

🌐 URL for this project: [https://quill-frontend.vercel.app/](https://quill-frontend.vercel.app/)

I have completed the development of the dashboard component for this project, which includes the integration of various charts using the rechart component. The backend will fetch data from database in supabase.

### Dashboard Component
The dashboard is designed to support multiple charts, providing a dynamic and interactive user interface for data visualization.

### Chart Component 
The chart utilized the rechart component to display the charts.

### API Modifications
As for the APIs, I made some modifications. For example:

#### Previous Chart API Endpoint
The initial design of the chart component required fetching data using only the `sqlQuery` parameter. However, this approach had limitations, as the data retrieval process was not straightforward. Additionally, identifying charts was challenging since the API only used `id` as a parameter, but in practice, `dashboardName` was the available key.

Endpoint:
`/chart/:id`

Response Structure:
```json
{
   "name": "string",
   "id": "string",
   "dashboardName": "string",
   "chartType": "line" | "bar",
   "sqlQuery": "string",
   "xAxisField": "string",
   "yAxisField": "string"
}
```

To address these issues, I revised the API endpoint to /charts/:dashboardName. This modification allows for more intuitive data retrieval based on the dashboardName, which is more readily available as a foreign key in our system.

Revised Chart API Endpoint
Endpoint:
/charts/:dashboardName

Response Structure:
```json
{
"config": {
            "name": "string",
            "id": "string",
            "dashboardName": "string",
            "chartType": "line" | "bar",
            "sqlQuery": "string",
            "xAxisField": "string",
            "yAxisField": "string"
        },
        "data": [
          ....
        ]
}
```
