import dotenv from 'dotenv';
dotenv.config();

class Env {
  static PORT = process.env.PORT || '8080';
  static ENVIRONMENT = process.env.MODE || "development"

  static OUTLOOK = {
    CLIENT_ID: process.env.OUTLOOK_CLIENT_ID || '',
    CLIENT_SECRET: process.env.OUTLOOK_CLIENT_SECRET || '',
    REDIRECT_URI: process.env.OUTLOOK_REDIRECT_URI || ''
  }

  static ELASTIC = {
    USERNAME: process.env.ELASTIC_USERNAME || '',
    PASSWORD: process.env.ELASTIC_PASSWORD || '',
    CLOUD_ID: process.env.ELASTIC_CLOUD_ID || '',
    INDEXES: {
      EMAILS: 'emails',
      MAIL_BOXES: 'mailboxes'
    }
  }
}

export default Env;
