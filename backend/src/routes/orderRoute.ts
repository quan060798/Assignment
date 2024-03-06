import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController';

const router = express.Router();

router.post('/create', createOrder);
router.get('/get', getOrders);

export default router;