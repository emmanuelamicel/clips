# Clips

A web app to view the latest Twitch clips from the channels you follow. Made using Node.js and the Twitch API.

## Launch

Go to <https://dev.twitch.tv/console/apps> and register a new app. Give redirect URL <http://localhost:3000/auth/twitch/callback>.

Create a `.env` file at the root of the folder containing the following variables:

```config
TWITCH_CLIENT_ID=
TWITCH_SECRET=
SESSION_SECRET=random
CALLBACK_URL=http://localhost:3000/auth/twitch/callback
```

Launch the application :

```bash
npm install
npm run dev
```

Access the list of clips at <http://localhost:3000/clips>.
