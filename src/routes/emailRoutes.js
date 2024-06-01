import express from 'express';
import Emails from '../controllers/emailController.js';

const emailRouter = express.Router();

emailRouter.get('/sync', Emails.syncEmails);
emailRouter.get('/emails', Emails.getEmails);

export default emailRouter
