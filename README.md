Go to your Backend Folder and install mkcert

```bash
brew install mkcert
```

put in password

Open /etc/hosts and add this line:

127.0.0.1 myspotifyapp.local

```bash
mkcert -install
mkcert myspotifyapp.local
```
