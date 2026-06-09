import { Router } from 'express';
import { getSelfieUploadUrl, registerSelfie, getMyPhotos } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/selfie-url', authenticate, getSelfieUploadUrl);
router.post('/register-selfie', authenticate, registerSelfie);
router.get('/my-photos', authenticate, getMyPhotos);

export default router;
