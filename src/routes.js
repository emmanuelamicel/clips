require('dotenv').config()
const axios = require('axios')

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID

async function getUserInfo(accessToken) {
  const url = 'https://api.twitch.tv/helix/users'
  const options = {
    headers: {
      'Client-Id': TWITCH_CLIENT_ID,
      'Authorization': 'Bearer ' + accessToken
    }
  }

  const response = await axios.get(url, options)
  return response.data
}

async function validateToken(accessToken) {
  const url = 'https://id.twitch.tv/oauth2/validate'
  const options = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  }

  const response = await axios.get(url, options)
  return response.data
}

async function getFollowedChannels(userId, accessToken) {
  // TODO: get all channels, even if there are more than 100
  const url = 'https://api.twitch.tv/helix/channels/followed'
  const options = {
    headers: {
      'Client-Id': TWITCH_CLIENT_ID,
      'Authorization': 'Bearer ' + accessToken
    },
    params: {
      user_id: userId,
      first: 100
    }
  }

  const response = await axios.get(url, options)
  return response.data
}

async function getLatestClips(broadcasterId, accessToken) {
  const currentDate = new Date()
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)

  const url = 'https://api.twitch.tv/helix/clips'
  const options = {
    headers: {
      'Client-Id': TWITCH_CLIENT_ID,
      'Authorization': 'Bearer ' + accessToken
    },
    params: {
      broadcaster_id: broadcasterId,
      started_at: oneWeekAgo
    }
  }

  const response = await axios.get(url, options)
  return response.data
}

module.exports = {
  getUserInfo,
  validateToken,
  getFollowedChannels,
  getLatestClips
}
