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

let urlDatabase = [];

app.post("/api/shorturl", (req, res) => {
  if(req.body.url.slice(0, 8) == "https://") {
    urlDatabase.push(req.body.url);
    res.json({original_url: req.body.url, shortUrl: urlDatabase.length});
  } else {
    res.json({error: 'invalid url'});
  }
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  res.writeHead(301, {Location: urlDatabase[req.params.shorturl - 1]}).end();
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
