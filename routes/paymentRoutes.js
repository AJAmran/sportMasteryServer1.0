import express from 'express';
import { createPayment, getPaymentsByEmail } from '../controllers/paymentController';

const router = express.Router();

// Routes related to payments
router.post('/create-payment', createPayment);
router.get('/payments/:email', getPaymentsByEmail);

export default router;
