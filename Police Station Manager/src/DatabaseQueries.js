import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '3309',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// Endpoint to fetch all police officers
app.get('/api/policeofficers', (req, res) => {
  const query = 'SELECT * FROM policeofficer';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch police officers' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/suspects', (req, res) => {
  const query = 'SELECT suspect.suspectID, suspect.fullName, suspect.dateOfBirth, COUNT(suspect_incident.incidentNumber) AS incidentCount FROM suspect JOIN suspect_incident ON suspect.suspectID = suspect_incident.suspectID GROUP BY suspect.suspectID, suspect.fullName, suspect.dateOfBirth ORDER BY incidentCount DESC;'

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch suspects' });
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});