import express from 'express';
import Auth from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/outlook', Auth.authOutlook);
authRouter.get('/outlook/callback', Auth.outlookCallback);

export default authRouter
