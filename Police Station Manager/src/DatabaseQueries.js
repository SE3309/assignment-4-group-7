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
  password: '@Somaliaisgood231',
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
  const { station, dateOfHire, badgeNumber, sortField, sortOrder, searchTerm, page, limit, groupByYear, hireYear } = req.query;
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
  if (hireYear) {
    conditions.push('YEAR(dateOfHire) = ?');
    queryParams.push(hireYear);
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
    if (sortField === 'hireYear') {
      query += ` ORDER BY YEAR(dateOfHire) ${sortOrder.toUpperCase()}`;
    } else if (sortField && (sortOrder === 'asc' || sortOrder === 'desc')) {
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

// Endpoint to fetch distinct hire years
app.get('/api/policeofficers/hireyears', (req, res) => {
  const query = 'SELECT DISTINCT YEAR(dateOfHire) AS hireYear FROM policeofficer ORDER BY hireYear ASC';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch hire years' });
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

// Endpoint to fetch warrants with multiple filters, sorting, and pagination
app.get('/api/warrants', (req, res) => {
  const { 
    warrantID, 
    issuedDate, 
    expirationDate, 
    warrantStatus, 
    suspectName, 
    suspectDOB, 
    sortField, 
    sortOrder, 
    searchTerm, 
    page = 1, 
    limit = 10 
  } = req.query;

  let query = 'SELECT * FROM warrant';
  const queryParams = [];
  const conditions = [];

  if (warrantID) {
    conditions.push('warrantID = ?');
    queryParams.push(warrantID);
  }
  if (issuedDate) {
    conditions.push('issuedDate = ?');
    queryParams.push(issuedDate);
  }
  if (expirationDate) {
    conditions.push('expirationDate = ?');
    queryParams.push(expirationDate);
  }
  if (warrantStatus) {
    conditions.push('warrantStatus = ?');
    queryParams.push(warrantStatus);
  }
  if (suspectName) {
    conditions.push('suspectName LIKE ?');
    queryParams.push(`%${suspectName}%`);
  }
  if (suspectDOB) {
    conditions.push('suspectDOB = ?');
    queryParams.push(suspectDOB);
  }
  if (searchTerm) {
    conditions.push('(suspectName LIKE ? OR warrantStatus LIKE ?)');
    queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (sortField && (sortOrder === 'asc' || sortOrder === 'desc')) {
    query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
  }

  const offset = (page - 1) * limit;
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(parseInt(limit), parseInt(offset));

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch warrants' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch active warrants issued in the last 30 days
app.get('/api/warrants/recent-active', (req, res) => {
  const query = `
    SELECT * FROM warrant
    WHERE warrantStatus = 'active'
    AND issuedDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    ORDER BY issuedDate DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error: ', err);
      res.status(500).json({ error: 'Failed to fetch recent active warrants' });
      return;
    }
    res.json(results);
  });
});


app.get("/api/equipment", (req, res) => {
  const { searchTerm, page = 1, limit = 10, status, type } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM policeEquipment WHERE 1=1`;
  const queryParams = [];

  if (searchTerm) {
    query += ` AND equipmentName LIKE ?`;
    queryParams.push(`%${searchTerm}%`);
  }
  if (status) {
    query += ` AND equipmentStatus = ?`;
    queryParams.push(status);
  }
  if (type) {
    query += ` AND equipmentType = ?`;
    queryParams.push(type);
  }

  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(parseInt(limit), parseInt(offset));

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Failed to fetch equipment data" });
    }
    res.json(results);
  });
});

app.get("/api/equipment/types", (req, res) => {
  const query = `SELECT DISTINCT equipmentType FROM policeEquipment`;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results.map((row) => row.equipmentType));
  });
});

app.get("/api/equipment/statuses", (req, res) => {
  const query = `SELECT DISTINCT equipmentStatus FROM policeEquipment`;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results.map((row) => row.equipmentStatus));
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/api/incidents", (req, res) => {
  const { searchTerm, page = 1, limit = 10, status, type } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM Incident WHERE 1=1`;
  const queryParams = [];

  if (searchTerm) {
    query += ` AND (incidentType LIKE ? OR location LIKE ?)`;
    queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }
  if (status) {
    query += ` AND incidentStatus = ?`;
    queryParams.push(status);
  }
  if (type) {
    query += ` AND incidentType = ?`;
    queryParams.push(type);
  }

  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(parseInt(limit), parseInt(offset));

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Failed to fetch incident data" });
    }
    res.json(results);
  });
});

app.get("/api/incidents/statuses", (req, res) => {
  const query = `SELECT DISTINCT incidentStatus FROM Incident`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Failed to fetch incident statuses" });
    }
    res.json(results.map((row) => row.incidentStatus));
  });
});

app.get("/api/incidents/types", (req, res) => {
  const query = `SELECT DISTINCT incidentType FROM Incident`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Failed to fetch incident types" });
    }
    res.json(results.map((row) => row.incidentType));
  });
});
