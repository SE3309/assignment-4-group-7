import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '3309'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Endpoint to fetch police officers by station location
app.get('/api/policeofficers', (req, res) => {
  const { station, sort } = req.query;
  let query = 'SELECT * FROM policeofficer';
  const queryParams = [];

  if (station) {
    query += ' WHERE stationLocation = ?';
    queryParams.push(station);
  }

  if (sort === 'asc' || sort === 'desc') {
    query += ` ORDER BY stationLocation ${sort.toUpperCase()}`;
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch police officers' });
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});