const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const filePath = path.join(__dirname, 'story', 'text.txt');

app.use(bodyParser.json());

app.get('/story', (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to open file.'});
    }
    res.status(200).json({ story: data.toString() });
  });
});

app.post('/story', (req, res) => {
  const newText = req.body && req.body.text; // Use the `&&` operator here
  if (!newText || newText.trim().length === 0) {
    return res.status(422).json({ message: 'Text must not be empty!' });
  }
  fs.appendFile(filePath, newText + '\n', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Storing the text failed.'});
    }
    res.status(201).json({ message: 'Text was stored!' });
  });
});

app.get('/error', (req, res) => { // Include the response parameter here
  res.status(500).json({ message: 'Something went wrong.' }); // Send a response instead of killing the process
});

app.listen(3000, () => {
  console.log('Server listening on port 3000.');
});
