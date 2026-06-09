import { Router } from 'express';
import { createEvent, getEvents, getEventById, createAlbum, getAlbumsByEvent } from '../controllers/eventController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN', 'PHOTOGRAPHER']), createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);

router.post('/albums', authenticate, authorize(['ADMIN', 'PHOTOGRAPHER']), createAlbum);
router.get('/:eventId/albums', authenticate, getAlbumsByEvent);

export default router;
