import express from 'express';
import { createJWT } from '../controllers/authController';

const router = express.Router();

// Route to create JWT
router.post('/create-jwt', createJWT);

export default router;
