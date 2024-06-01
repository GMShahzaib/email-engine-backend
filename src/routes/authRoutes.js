import express from 'express';
import Auth from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/auth/outlook', Auth.authOutlook);
authRouter.get('/callback', Auth.outlookCallback);

export default authRouter