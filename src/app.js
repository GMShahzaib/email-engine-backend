import express from 'express';

import { SUCCESSFUL } from './utils/constants.js';

//routes
import authRouter from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import { verifyToken } from './utils/signToken.js';

const router = express.Router();


router.use('/auth',authRouter)
router.use('/emails',verifyToken,emailRoutes)

router.get('/test', (req, resp) => {
  resp.send({ status: SUCCESSFUL });
});

export default router;