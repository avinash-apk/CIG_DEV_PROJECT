import { Router } from 'express';
import { createEvent, getEvents, getEventById } from '../controllers/eventController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN', 'PHOTOGRAPHER']), createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);

export default router;
