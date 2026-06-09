import { Router } from 'express';
import { downloadWithWatermark } from '../controllers/downloadController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, downloadWithWatermark);

export default router;
