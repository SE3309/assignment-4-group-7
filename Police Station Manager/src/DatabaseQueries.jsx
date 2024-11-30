// Import the mysql2 package
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // e.g., 'localhost' or your EC2 public IP address
  user: process.env.DB_USER, // e.g., 'root'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // e.g., 'mydatabase'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);

  // Example query
  const query = 'SELECT * FROM List;';
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error('Query error: ', err);
      return;
    }
    console.log('Results: ', results);
  });

  // Close the connection
  connection.end();
});