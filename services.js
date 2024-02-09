
if (!process.env.APPLICATION_ID || !process.env.PRIVATE_KEY_PATH) {
  console.log("Missing ENV VARs: APPLICATION_ID and PRIVATE_KEY_PATH");
  process.exit(1);
}

const path = require("path");
const fs = require("fs");
const { Auth } = require("@vonage/auth");
const { Video } = require("@vonage/video");

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, process.env.PRIVATE_KEY_PATH));
const auth = new Auth({
  applicationId: process.env.APPLICATION_ID,
  privateKey: PRIVATE_KEY,
});

const options = {
  videoHost: "https://video.api.vonage.com"
};

const videoClient = new Video(auth, options);

const createSession = async () => {
  const sessionOptions = {
    archiveMode: "manual",
    mediaMode: "routed",
  };

  try {
    const session = await videoClient.createSession(sessionOptions);
    console.log({ session });
    return session;
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

const generateClientToken = (sessionId) => {
  const token = videoClient.generateClientToken(sessionId);
  return token;
}

module.exports = {
  createSession,
  generateClientToken,
  videoClient,
};
