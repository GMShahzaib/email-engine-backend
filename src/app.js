import express from 'express';

import { SUCCESSFUL } from './utils/const.values.js';

//routes
import authRouter from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

const router = express.Router();


router.use('/auth',authRouter)
router.use('/emails',emailRoutes)

router.get('/test', (req, resp) => {
  resp.send({ status: SUCCESSFUL });
});

export default router;
