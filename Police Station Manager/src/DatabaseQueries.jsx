const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);

  // Test query to verify connection
  const query = 'SELECT 1 + 1 AS solution';
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error('Query error: ', err);
      return;
    }
    console.log('Test query result: ', results[0].solution); // Should output: 2
  });

  // Close the connection
  connection.end();
});