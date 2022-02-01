require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({extended: false}));

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = [];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;

  if (url === "") return res.json({"error": "invalid url"});
  
  if(url.match(/^https?:\/\//)) {
    urlDatabase.push(url);
    return res.json(
      {
        "original_url": url,
        "short_url": urlDatabase.length
      }
    );
  } else {
    return res.json({"error": "invalid url"});
  }
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id - 1;
  return urlDatabase[id] ? res.redirect(urlDatabase[id]) :res.json({"error": "invalid URL"});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
