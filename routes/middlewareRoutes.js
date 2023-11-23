import express from 'express';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import roleVerificationMiddleware from '../middlewares/roleVerificationMiddleware';

const router = express.Router();

// Middleware routes
router.use(authenticateToken);


router.get('/admin-route', roleVerificationMiddleware('admin'), (req, res) => {
  res.send('Admin Route');
});

export default router;
