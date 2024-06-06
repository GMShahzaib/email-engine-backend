import express from 'express';
import Emails from '../controllers/emailController.js';

const emailRouter = express.Router();

emailRouter.get('/', Emails.getEmails);
emailRouter.get('/sync', Emails.syncEmails);

export default emailRouter
