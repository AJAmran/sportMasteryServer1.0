import express from 'express';
import { createUser, getUsers, getUserByEmail } from '../controllers/userController';

const router = express.Router();

// Routes related to users
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:email', getUserByEmail);

export default router;
