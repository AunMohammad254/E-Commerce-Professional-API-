const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getUserOrders, 
    getOrder, 
    updateOrderStatus 
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/history', authenticate, getUserOrders); // Alternative route for order history
router.get('/:id', authenticate, getOrder);
router.patch('/:id/status', authenticate, updateOrderStatus);

module.exports = router;