## Setting Up Your Computer to Test Spotify Locally

This repository was made to serve as an example of how you can get a server to run locally but use https and "not" be on localhost. It was made due to the new restructions on Spotify's API which state that the redirect URI provided to the API must use HTTPs, except in the case that you are using a loopback address, and cannot use localhost.

### Mac Instructions

1. Go to your Backend Folder and install mkcert, enter your password where prompted

```bash
brew install mkcert
```

2. Open `/etc/hosts` and add this line: `127.0.0.1 myspotifyapp.local` in the Local section
```bash
sudo nano /etc/hosts
```

3. Create a new certificate by runnning the following in your terminal

```bash
mkcert -install
mkcert myspotifyapp.local
```

4. Update your server to run like this :

```javascript
const https = require("https");

/* other imports, middleware, routes, etc */

const options = {
  key: fs.readFileSync("test-spotify-site.local-key.pem"),
  cert: fs.readFileSync("test-spotify-site.local.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(
    `HTTPS Server is running on https://test-spotify-site.local:${port}`
  );
});
```

### Windows Instructions

1. Go to your Backend Folder and install mkcert, enter your password where prompted

```bash
choco install mkcert
```

2. Open `C:\Windows\System32\drivers\etc\hosts` and add this line: `127.0.0.1 myspotifyapp.local` in the Local section

3. Create a new certificate by runnning the following in your terminal

```bash
mkcert -install
mkcert myspotifyapp.local
```

4. Update your server to run like this :

```javascript
const https = require("https");

/* other imports, middleware, routes, etc */

const options = {
  key: fs.readFileSync("test-spotify-site.local-key.pem"),
  cert: fs.readFileSync("test-spotify-site.local.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(
    `HTTPS Server is running on https://test-spotify-site.local:${port}`
  );
});
```

### Notes for Students

- When you finish these steps, add your .pem files to your `.gitignore`, I left mine in the repo for an example but each of you will need your own files
- Be sure your callback uri is in your spotify developer settings
