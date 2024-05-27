const express = require('express');
const app = express();
const path = require('path');
var sql = require("mssql");
var favicon = require('serve-favicon');
const bodyParser = require('body-parser'); // Require body-parser module
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

app.post('/transcript', (req, res) => {
    // Extracting data from the request body
    const { id, transcript, bgInfoQualtrics } = req.body;
    console.log("ID IS: ", id);
    console.log("transcript IS: ", transcript);
    console.log("bgInfoQualtrics IS: ", bgInfoQualtrics);
    
    // BEGIN DATABASE STUFF: SENDING VERSION (R24 OR U01) AND ID TO DATABASE
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // create Request object
        var request = new sql.Request();

        // Construct SQL query with parameterized values
        let queryString = `INSERT INTO CAT (ID, bgInfoQualtrics, transcript) VALUES (@id, @bgInfoQualtrics, @transcript)`;
        
        // Bind parameterized values
        request.input('id', sql.NVarChar, id);
        request.input('transcript', sql.NVarChar, transcript);
        request.input('bgInfoQualtrics', sql.NVarChar, bgInfoQualtrics);

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
