const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const filePath = path.join(__dirname, 'story', 'text.txt');

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Handle GET requests to /story
app.get('/story', (req, res) => {
  // Read the file asynchronously and respond with its contents
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If there's an error, respond with a 500 status and an error message
      return res.status(500).json({ message: 'Failed to open file.'});
    }
    // If successful, respond with a 200 status and the contents of the file
    res.status(200).json({ story: data.toString() });
  });
});

// Handle POST requests to /story
app.post('/story', (req, res) => {
  // Get the text from the request body
  const newText = req.body.text;
  if (!newText || newText.trim().length === 0) {
    // If the text is empty or missing, respond with a 422 status and an error message
    return res.status(422).json({ message: 'Text must not be empty!' });
  }
  // Append the text to the file asynchronously
  fs.appendFile(filePath, newText + '\n', (err) => {
    if (err) {
      // If there's an error, respond with a 500 status and an error message
      return res.status(500).json({ message: 'Storing the text failed.'});
    }
    // If successful, respond with a 201 status and a success message
    res.status(201).json({ message: 'Text was stored!' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
