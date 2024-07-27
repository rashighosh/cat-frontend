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
app.get('/browse', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'browse.html'));
});

// Define a route for the homepage
app.get('/browseInstructions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'browseInstructions.html'));
});

// Define a route for the homepage
app.get('/information', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'information.html'));
});

// Define a route for the homepage
app.get('/continue', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'continue.html'));
});

// Define a route for the homepage
app.get('/gross', (req, res) => {
  // Set the content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  // Send the plain text content
  res.send('gross');
});

app.post('/logUser', (req, res) => {
  // Extracting data from the request body
  const { id, condition, startTime } = req.body;

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

app.post('/logUserInfo', (req, res) => {
  const { id, surveyAnswers, briefScore, backgroundInfo } = req.body;

  console.log("SURVEY ANSWERS", surveyAnswers)
  console.log("BACKGROUND INFO ", backgroundInfo)
  console.log("BRIEF SCORE", briefScore)

  sql.connect(config, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    var request = new sql.Request();
    let queryString;

    if (backgroundInfo != null && surveyAnswers != null) {
      let updateColumnsSurvey = Object.keys(surveyAnswers).map(key => `${key} = @${key}`).join(', ');
      let updateColumnsBackground = Object.keys(backgroundInfo).map(key => `${key} = @${key}`).join(', ');
      let combinedUpdateColumns = [updateColumnsSurvey, updateColumnsBackground, 'BRIEFScore = @briefScore'].join(', ');
      queryString = `UPDATE CAT SET ${combinedUpdateColumns} WHERE ID = @id`;
    } else {
      queryString = `UPDATE CAT SET BRIEFScore = @briefScore WHERE id = @id`;
    }

    request.input('id', sql.NVarChar, id);
    request.input('briefScore', sql.Int, briefScore);

    if (backgroundInfo != null && surveyAnswers != null) {
      Object.entries(surveyAnswers).forEach(([key, value]) => {
        request.input(key, sql.Int, value);
      });
      Object.entries(backgroundInfo).forEach(([key, value]) => {
        request.input(key, sql.NVarChar, value);
      });
    }

    request.query(queryString, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({ message: 'Other data inserted successfully.' });
    });
  });
});

app.post('/updateTranscript', (req, res) => {
  const { id, transcriptType, transcript } = req.body;

  sql.connect(config, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    var request = new sql.Request();
    const queryString = `UPDATE CAT SET ${transcriptType} = @transcript WHERE id = @id`;

    request.input('id', sql.NVarChar, id);
    request.input('transcript', sql.NVarChar, transcript);

    request.query(queryString, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({ message: 'Transcript inserted successfully.' });
    });
  });
});

app.post('/getUserInfo', (req, res) => {
  const { id } = req.body;
  
  // Connect to the database
  sql.connect(config, function (err) {
      if (err) {
          console.error('Error connecting to the database:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      var request = new sql.Request();

      // Check if user exists
      const checkUserQuery = `SELECT COUNT(*) AS userCount FROM CAT WHERE ID = @id`;
      request.input('id', sql.NVarChar, id);

      request.query(checkUserQuery, function (err, userCheckResult) {
          if (err) {
              console.error('Error checking user existence:', err);
              return res.status(500).json({ error: 'Error checking user existence' });
          }

          if (userCheckResult.recordset[0].userCount === 0) {
              return res.status(404).json({ error: 'User not found' });
          }

          // If user exists, proceed with fetching data
          const surveyQueryCommStyle = `SELECT Talkativeness, Casualness, Conciseness FROM CAT WHERE ID = @id`;

          request.query(surveyQueryCommStyle, function (err, surveyQueryCommStyleResult) {
              if (err) {
                  console.error('Error fetching survey answers:', err);
                  return res.status(500).json({ error: 'Error fetching survey answers' });
              }

              const surveyQueryBRIEF = `SELECT BRIEFScore FROM CAT WHERE ID = @id`;
              request.query(surveyQueryBRIEF, function (err, surveyQueryBRIEFResult) {
                  if (err) {
                      console.error('Error fetching survey answers:', err);
                      return res.status(500).json({ error: 'Error fetching survey answers' });
                  }

                  const backgroundQuery = `SELECT ReceivingInformation, WhoDoYouConsultWith, OpportunitytoParticipate FROM CAT WHERE ID = @id`;
                  request.query(backgroundQuery, function (err, backgroundResult) {
                      if (err) {
                          console.error('Error fetching background info:', err);
                          return res.status(500).json({ error: 'Error fetching background info' });
                      }

                      // Close the database connection
                      sql.close();

                      // Extract the data from the query results
                      const surveyAnswersCommStyle = surveyQueryCommStyleResult.recordset[0];
                      const surveyAnswersBRIEF = surveyQueryBRIEFResult.recordset[0];
                      const backgroundInfo = backgroundResult.recordset[0];

                      // Send the data back to the client
                      res.json({ surveyAnswersCommStyle, surveyAnswersBRIEF, backgroundInfo });
                  });
              });
          });
      });
  });
});

app.post('/logBrowseTrialsChoice', (req, res) => {
  const { id, BrowseTrialsChoice } = req.body;

  console.log("BrowseTrialsChoice", BrowseTrialsChoice);

  sql.connect(config, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    var request = new sql.Request();
    let queryString = `UPDATE CAT SET BrowseTrialsChoice = @BrowseTrialsChoice WHERE ID = @id`;

    request.input('id', sql.NVarChar, id);
    request.input('BrowseTrialsChoice', sql.NVarChar, BrowseTrialsChoice);

    request.query(queryString, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({ message: 'BrowseTrialsChoice updated successfully.' });
    });
  });
});





// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
