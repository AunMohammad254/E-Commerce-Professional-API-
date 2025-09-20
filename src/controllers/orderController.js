const Order = require('../models/Order');
const Product = require('../models/Product');
const emailService = require('../utils/emailService');

// Create Order
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, paymentDetails } = req.body;

        // Validate items and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product || product.isDeleted) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${item.product} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}`
                });
            }

            // Update stock
            product.stock -= item.quantity;
            await product.save();

            // Calculate price
            const price = product.price * (1 - product.discountPercentage / 100);
            totalAmount += price * item.quantity;

            orderItems.push({
                product: item.product,
                quantity: item.quantity,
                price
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentDetails
        });

        // Populate order for email
        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name email')
            .populate('items.product', 'title price');

        // Send email notifications
        try {
            await emailService.sendOrderConfirmation(populatedOrder);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the order creation if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: populatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};

// Get User Orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'title thumbnail price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

// Get Single Order
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check ownership
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update status
        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrder,
    updateOrderStatus
};