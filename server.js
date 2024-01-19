require('dotenv').config();

const OT_API_KEY = process.env.OT_API_KEY;
const OT_API_SECRET = process.env.OT_API_SECRET;
if (!OT_API_KEY || !OT_API_SECRET) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

const cors = require("cors");
const express = require('express');

const OpenTok = require('opentok');
const opentok = new OpenTok(process.env.OT_API_KEY, process.env.OT_API_SECRET);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (!app.get('sessionId')) {
  const options = {
    mediaMode: "routed"
  };

  opentok.createSession(options, function (err, { sessionId }) {
    if (err) {
      console.log(err)
      return process.exit();
    }
    else {
      console.log ({ sessionId })
      app.set('sessionId', sessionId);
    }
  });
}

app.get('/token', (req, res) => {
  let token = opentok.generateToken(req.app.get('sessionId'));
  return res.json({
    apiKey: process.env.OT_API_KEY,
    sessionId: app.get('sessionId'),
    token
  })
});

const PORT = 3002
app.listen(PORT, function () {
  console.log(`[] listening on http://localhost:${PORT}/`);
});