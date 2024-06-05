import fetch from 'node-fetch';
import oauth2 from '../config/oauth.js';
import Env from '../env/Env.js';

// Function to exchange authorization code for access and refresh tokens
export async function getOAuthTokens(code) {
  return new Promise((resolve, reject) => {
    oauth2.getOAuthAccessToken(
      code,
      { grant_type: 'authorization_code', redirect_uri: Env.OUTLOOK.REDIRECT_URI },
      (err, accessToken, refreshToken, params) => {
        if (err) {
          return reject(err);
        }
        resolve({ accessToken, refreshToken, params });
      }
    );
  });
}

// Function to fetch emails using access token
export const fetchEmails = async (accessToken) => {
  const response = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data.value; // Returning the array of email messages
};

// Function to fetch user details using access token
export const fetchMe = async (accessToken) => {
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data;
};
