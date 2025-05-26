const express = require("express");
const router = express.Router();

require(`dotenv`).config();
const https = require("https");
const querystring = require("querystring");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectURI = "http://localhost:3000/callback";

const generateRandomString = (length) => {
  let text = ``;
  const possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const stateKey = `spotify_auth_state`;

router.get(`/`, (request, response) => {
  const state = generateRandomString(16);
  response.cookie(stateKey, state);

  const scope = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-library-read",
  ].join(" ");

  const queryParams = querystring.stringify({
    client_id: clientId,
    response_type: `code`,
    redirect_uri: redirectURI,
    state: state,
    scope: scope,
  });
  response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// Helper function to make HTTPS POST requests
const makeHttpsRequest = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsedData,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
};

router.get(`/callback`, async (req, res) => {
  const code = req.query.code || null;

  const postData = querystring.stringify({
    grant_type: `authorization_code`,
    code: code,
    redirect_uri: redirectURI,
  });

  const options = {
    hostname: "accounts.spotify.com",
    path: "/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
  };

  try {
    const response = await makeHttpsRequest(options, postData);

    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;

      const queryParams = querystring.stringify({
        access_token,
        refresh_token,
        expires_in,
      });

      res.redirect(`http://localhost:5173/?${queryParams}`);
    } else {
      res.redirect(`/?${querystring.stringify({ error: `invalid_token` })}`);
    }
  } catch (error) {
    res.send(error);
  }
});

router.get(`/refresh_token`, async (req, res) => {
  const { refresh_token } = req.query;

  const postData = querystring.stringify({
    grant_type: `refresh_token`,
    refresh_token: refresh_token,
  });

  const options = {
    hostname: "accounts.spotify.com",
    path: "/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
  };

  try {
    const response = await makeHttpsRequest(options, postData);
    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
