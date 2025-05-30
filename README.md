## Setting Up Your Computer to Test Spotify Locally

This repository was made to serve as an example of how you can get a server to run locally but use https and "not" be on localhost. It was made due to the new restructions on Spotify's API which state that the redirect URI provided to the API must use HTTPs, except in the case that you are using a loopback address, and cannot use localhost.

### Mac Instructions

1. Go to your Backend Folder and install mkcert, enter your password where prompted

```bash
brew install mkcert
```

2. Open `/etc/hosts` and add this line: `127.0.0.1 test-spotify-site.local` in the Local section

```bash
sudo nano /etc/hosts
```

3. Create a new certificate by runnning the following in your terminal

```bash
mkcert -install
mkcert test-spotify-site.local
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

- If you do not have choco you can find the install guide here: https://chocolatey.org/install

2. Open `C:\Windows\System32\drivers\etc\hosts` and add this line: `127.0.0.1 test-spotify-site.local` in the Local section
- You can open files with CMD+Shift+P in VSCode and then type File:Open File...
- Add the line `127.0.0.1 test-spotify-site.local` at the bottom of the hosts file under "# ::1 localhost"
- Save the hosts file 

4. Create a new certificate by runnning the following in your terminal

```bash
mkcert -install
mkcert test-spotify-site.local
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
