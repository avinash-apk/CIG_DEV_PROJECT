import { Router } from 'express';
import { getUploadUrl, registerMedia, getMediaByAlbum } from '../controllers/mediaController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/upload-url', authenticate, authorize(['ADMIN', 'PHOTOGRAPHER']), getUploadUrl);
router.post('/register', authenticate, authorize(['ADMIN', 'PHOTOGRAPHER']), registerMedia);
router.get('/album/:albumId', authenticate, getMediaByAlbum);

export default router;
