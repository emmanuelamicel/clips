require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const { Strategy: OAuth2Strategy } = require('passport-oauth2')

const routes = require('./routes')

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID
const TWITCH_SECRET = process.env.TWITCH_SECRET
const SESSION_SECRET = process.env.SESSION_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL

const app = express()
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

passport.use('twitch', new OAuth2Strategy({
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  clientID: TWITCH_CLIENT_ID,
  clientSecret: TWITCH_SECRET,
  callbackURL: CALLBACK_URL,
  state: true,
  passReqToCallback: true,
  scope: 'user:read:follows'
}, function (req, accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken
  profile.refreshToken = refreshToken

  if (req.session.returnTo) {
    const returnTo = req.session.returnTo
    delete req.session.returnTo
    return done(null, { profile, returnTo })
  } else {
    done(null, profile)
  }
}))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

app.get('/auth/twitch', function (req, res, next) {
  req.session.returnTo = req.query.returnTo || '/'
  next()
},
  passport.authenticate('twitch')
)

app.get('/auth/twitch/callback', passport.authenticate('twitch'), (req, res) => {
  res.redirect('http://localhost:3000' + req.session.passport.user.returnTo || '/')
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/auth/twitch?returnTo=' + req.originalUrl)
}

app.use(ensureAuthenticated)

app.get('/', function (req, res) {
  if (req.session && req.session.passport && req.session.passport.user) {
    res.send(req.session.passport.user)
  } else {
    res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch">Authenticate</a></html>')
  }
})

app.get('/profile', async function (req, res) {
  const accessToken = req.session.passport.user.profile.accessToken
  try {
    // TODO: add token scopes
    let response = await routes.getUserInfo(accessToken)
    res.send(response)
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des informations utilisateur : ' + err)
  }
})

app.get('/clips', async function (req, res) {
  const accessToken = req.session.passport.user.profile.accessToken
  try {
    let user = await routes.getUserInfo(accessToken)
    let userId = user.data[0].id

    let followedChannels = await routes.getFollowedChannels(userId, accessToken)

    let clipPromises = followedChannels.data.map(async function (broadcaster) {
      return routes.getLatestClips(broadcaster.broadcaster_id, accessToken)
    })
    let clips = await Promise.all(clipPromises)
    let allClips = [].concat(...clips.map(clipData => clipData.data))

    res.send(allClips)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.listen(3000, function () {
  console.log('Twitch auth sample listening on port 3000!')
})
