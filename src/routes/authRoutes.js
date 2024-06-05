import express from 'express';
import Auth from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/outlook', Auth.authOutlook);
authRouter.get('/outlook/callback', Auth.outlookCallback);

authRouter.post('/register', Auth.register);
authRouter.post('/login', Auth.login);



export default authRouter
