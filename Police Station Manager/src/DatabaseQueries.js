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
  password: 'Laylabhalla!724',
  database: '3309'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Endpoint to fetch police officers with multiple filters, sorting, pagination, and grouping by year of hire
app.get('/api/policeofficers', (req, res) => {
  const { station, dateOfHire, badgeNumber, sortField, sortOrder, searchTerm, page, limit, groupByYear } = req.query;
  let query = 'SELECT * FROM policeofficer';
  const queryParams = [];

  const conditions = [];
  if (station) {
    conditions.push('stationLocation = ?');
    queryParams.push(station);
  }
  if (dateOfHire) {
    conditions.push('dateOfHire = ?');
    queryParams.push(dateOfHire);
  }
  if (badgeNumber) {
    conditions.push('badgeNumber = ?');
    queryParams.push(badgeNumber);
  }
  if (searchTerm) {
    conditions.push('fullName LIKE ?');
    queryParams.push(`%${searchTerm}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (groupByYear === 'true') {
    query = `
      SELECT 
        YEAR(dateOfHire) AS hireYear, 
        COUNT(badgeNumber) AS officerCount
      FROM 
        policeofficer
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
      GROUP BY 
        hireYear
      ORDER BY 
        hireYear ASC
    `;
  } else {
    if (sortField && (sortOrder === 'asc' || sortOrder === 'desc')) {
      query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
    }

    if (page && limit) {
      const offset = (page - 1) * limit;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(parseInt(limit), parseInt(offset));
    }
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

// Endpoint to fetch all police officers location
app.get('/api/policeofficers/location', (req, res) => {
  const query = 'SELECT DISTINCT stationLocation FROM policeofficer';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch police officer locations' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch all policeStations 
app.get('/api/policestation', (req, res) => {
  const query = 'SELECT * FROM policestation';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch police station' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch police station with most officers
app.get('/api/policestation/mostOfficers', (req, res) => {
  const query = `SELECT 
    PS.stationName, 
    PS.location, 
    COUNT(PO.badgeNumber) AS officerCount
    FROM 
    policeStation PS
    JOIN 
    policeOfficer PO ON PS.location = PO.stationLocation
    GROUP BY 
    PS.stationName, PS.location
    ORDER BY 
    officerCount DESC
    LIMIT 1;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch officers in police station' });
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