import { Router } from 'express';
import { likeMedia, addComment, toggleFavorite, getNotifications } from '../controllers/socialController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/like', authenticate, likeMedia);
router.post('/comment', authenticate, addComment);
router.post('/favorite', authenticate, toggleFavorite);
router.get('/notifications', authenticate, getNotifications);

export default router;
