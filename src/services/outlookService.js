import fetch from 'node-fetch';

export const fetchEmails = async (accessToken) => {
  const response = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data.value;  // Returning the array of email messages
};