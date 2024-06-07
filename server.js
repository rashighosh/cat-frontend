const express = require('express');
const app = express();
const path = require('path');
var sql = require("mssql");
var favicon = require('serve-favicon');
const bodyParser = require('body-parser'); // Require body-parser module
const { ok } = require('assert');
require('dotenv').config()

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(favicon(path.join(__dirname,'public','favicon.ico')));

// Parse application/json
app.use(bodyParser.json());

const config = {
    user: 'VergAdmin',
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    port: parseInt(process.env.DBPORT, 10), 
    database: process.env.DATABASE,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define a route for the homepage
app.get('/interaction', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'interaction.html'));
});

// Define a route for the homepage
app.get('/information', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'information.html'));
});

app.post('/logUser', (req, res) => {
  // Extracting data from the request body
  const { id, condition, startTime } = req.body;
  console.log("id IS: ", id);
  console.log("condition IS: ", condition);  
  console.log("startTime IS: ", startTime);  

  // BEGIN DATABASE STUFF: SENDING VERSION (R24 OR U01) AND ID TO DATABASE
  sql.connect(config, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // create Request object
    var request = new sql.Request();

    // Check if ID already exists
    let checkIfExistsQuery = `SELECT TOP 1 ID FROM CAT WHERE ID = @id`;

    // Bind parameterized value for ID
    request.input('id', sql.NVarChar, id);

    // Execute the query to check if the ID already exists
    request.query(checkIfExistsQuery, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database: Internal Server Error' });
      }

      // If the recordset has rows, then the ID already exists
      if (recordset && recordset.recordset.length > 0) {
        return res.status(200).json({ message: 'Database: ID already exists.' });
      } else {
        // Construct SQL query with parameterized values to insert the record
        let insertQuery = `INSERT INTO CAT (ID, condition, startTime) VALUES (@id, @condition, @startTime)`;
      
        // Bind parameterized values
        request.input('condition', sql.Int, condition);
        request.input('startTime', sql.NVarChar, startTime);

        // Execute the query to insert the record
        request.query(insertQuery, function (err, recordset) {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Database: Internal Server Error' });
          }
          res.status(200).json({ message: 'Database: User inserted successfully.' });
        }); 
      }
    });
  });
});



app.post('/transcript', (req, res) => {
    // Extracting data from the request body
    const { transcriptType, transcript, id } = req.body;
    
    // BEGIN DATABASE STUFF: SENDING VERSION (R24 OR U01) AND ID TO DATABASE
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // create Request object
        var request = new sql.Request();

        // Construct SQL query with parameterized values
        let queryString = `UPDATE CAT SET ${transcriptType} = @transcript WHERE id = @id`;
        
        // Bind parameterized values
        request.input('id', sql.NVarChar, id);
        request.input('transcript', sql.NVarChar, transcript);

        // Execute query
        request.query(queryString, function (err, recordset) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({ message: 'Data inserted successfully.' });
        }); 

    });
    // END DATABASE STUFF
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
