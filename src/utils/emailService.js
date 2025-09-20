const emailjs = require('emailjs-com');

const SERVICE_ID = 'service_lqqiban';
const TEMPLATE_ID = 'template_default'; // You'll need to create this in EmailJS
const USER_ID = 'YOUR_EMAILJS_USER_ID'; // Add your EmailJS user ID
const ADMIN_EMAIL = 'aunmohammad254@gmail.com';

const sendOrderConfirmation = async (order) => {
    try {
        // Prepare email data
        const orderDetails = {
            order_id: order._id,
            customer_name: order.user.name,
            customer_email: order.user.email,
            total_amount: order.totalAmount,
            payment_method: order.paymentMethod,
            items: order.items.map(item => ({
                product: item.product.title,
                quantity: item.quantity,
                price: item.price
            })),
            shipping_address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`,
            order_date: new Date(order.createdAt).toLocaleString()
        };

        // Send email to customer
        const customerEmailParams = {
            to_email: order.user.email,
            to_name: order.user.name,
            from_name: 'E-Commerce Store',
            order_details: JSON.stringify(orderDetails, null, 2),
            message: `Thank you for your order! Your order #${order._id} has been confirmed.`
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, customerEmailParams, USER_ID);

        // Send email to admin
        const adminEmailParams = {
            to_email: ADMIN_EMAIL,
            to_name: 'Admin',
            from_name: 'E-Commerce System',
            order_details: JSON.stringify(orderDetails, null, 2),
            message: `New order received from ${order.user.name} (${order.user.email})`
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, adminEmailParams, USER_ID);

        console.log('Order confirmation emails sent successfully');
        return true;
    } catch (error) {
        console.error('Failed to send order confirmation emails:', error);
        throw error;
    }
};

const sendPaymentConfirmation = async (order, paymentDetails) => {
    try {
        const emailParams = {
            to_email: order.user.email,
            to_name: order.user.name,
            from_name: 'E-Commerce Store',
            order_id: order._id,
            payment_amount: order.totalAmount,
            payment_method: order.paymentMethod,
            transaction_id: paymentDetails.transactionId || 'N/A',
            message: `Payment received for order #${order._id}`
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, USER_ID);

        // Also send to admin
        emailParams.to_email = ADMIN_EMAIL;
        emailParams.to_name = 'Admin';
        emailParams.message = `Payment received from ${order.user.name} for order #${order._id}`;
        
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, USER_ID);

        return true;
    } catch (error) {
        console.error('Failed to send payment confirmation emails:', error);
        throw error;
    }
};

module.exports = {
    sendOrderConfirmation,
    sendPaymentConfirmation
};