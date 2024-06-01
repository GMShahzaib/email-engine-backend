import oauth from 'oauth';
import Env from '../env/Env.js';

const oauth2 = new oauth.OAuth2(
  Env.OUTLOOK.CLIENT_ID,
  Env.OUTLOOK.CLIENT_SECRET,
  'https://login.microsoftonline.com/common/',
  'oauth2/v2.0/authorize',
  'oauth2/v2.0/token',
  null
);

export default oauth2