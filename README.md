# video-unified-dashboard-new-sdk

A simple react app showcase video apps migrates to the unified dashboard, with the new cldent sdk @vonage/client-sdk-video and the new server sdk "@vonage/video".

## main changes to migrate the app from "opentok" and "@opentok/client" to the above new skds

- app server side: replace "opentok" with "@vonage/video", update createSession and generate a token for clients
```js
// const OpenTok = require("opentok");  // changed to
const { Auth } = require("@vonage/auth");
const { Video } = require("@vonage/video");
const auth = new Auth({
  applicationId
  privateKey
});
const videoClient = new Video(auth, options);
// ...
// opentok.createSession(options, function (err, session) { ... } // changed to
const session = await videoClient.createSession(sessionOptions);
// ...
// opentok.generateToken(req.app.get("sessionId")); // changed to
const token = generateClientToken(sessionId);
```

- app client side: replact "@opentok/client" with "@vonage/client-sdk-video", and use `applicationId` instead of apiKey for `OT.initSession()`
```js
// import OT from "@opentok/client"; // changed to
import OT from "@vonage/client-sdk-video";
// ...
// OT.initSession(apiKey, sessionId); // changed to
OT.initSession(applicationId, sessionId);
```


## Prerequisite  
- Vonage Appliction Account: get `applicationId` and `privateKey`

## Install

- `npm install`
- `cp env.example to .env`, and add your credentials `APPLICATION_ID` and `PRIVATE_KEY_PATH` there.

## Available Scripts

In the project directory, you can run:

### `npm run server`
Start server, a simple sever that uses one opentok session only, just a sample

### `npm start`

Open [http://localhost:3002](http://localhost:3002) to view it in your browser.


### Click that button to toggle the noise suppression processor
![Example Screenshot](./screenshot.png)


