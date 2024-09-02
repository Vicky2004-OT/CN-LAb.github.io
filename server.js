const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourUsername',
  password: 'yourPassword',
  database: 'UserData'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Handle login requests
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to check if the username exists
  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Server error');
      return;
    }

    if (results.length > 0) {
      const user = results[0];

      // Compare the hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.send('Login successful!');
        } else {
          res.send('Invalid username or password.');
        }
      });
    } else {
      res.send('Invalid username or password.');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
