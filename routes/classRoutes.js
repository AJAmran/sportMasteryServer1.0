import express from 'express';
import { 
  createClass,
  getClasses,
  getClassesByEmail,
  getClassById,
  updateClassStatus,
  addFeedback,
  reduceSeats
} from '../controllers/classController';

const router = express.Router();

// Routes related to classes
router.post('/classes', createClass);
router.get('/classes', getClasses);
router.get('/email/classes/:email', getClassesByEmail);
router.get('/classes/:id', getClassById);
router.put('/classes/:id', updateClassStatus);
router.post('/classes/:id/feedback', addFeedback);
router.put('/classes/:id/reduce-seats', reduceSeats);

export default router;
