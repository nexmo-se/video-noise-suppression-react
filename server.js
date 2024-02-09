require('dotenv').config();
const express = require('express');
const cors = require("cors");

const { createSession, generateClientToken } = require("./services.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/token', (req, res) => {
  const sessionId = app.get('sessionId');
  if (!sessionId) {
    return res.json([`!!! sessionId is undefined !!`]);
  }
  const token = generateClientToken(sessionId);
  return res.json({
    appId: process.env.APPLICATION_ID,
    sessionId: sessionId,
    token
  });
});

app.all('/*', (req, res) => {
  res.sendStatus(200);
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send(err.message || 'Internal Server Error')
});

////////////////////////////////////////////////////////////////////////////////
const PORT = 3000;
createSession().then(({ sessionId }) => {

  if (sessionId) {
    // console.log(`!!! sessionId is created !!`, {sessionId});
    app.set('sessionId', sessionId);
  } else {
    console.log(`!!! sessionId is undefined !!`);
  }

  app.listen(PORT, function () {
    console.log(`[] listening on http://localhost:${PORT}/`);
  });

}).catch((e) => {
  console.log(e);
  process.exit(1);
});

