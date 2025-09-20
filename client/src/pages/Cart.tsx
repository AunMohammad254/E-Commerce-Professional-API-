import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { emailService, OrderDetails } from '../services/emailService';

const Cart: React.FC = () => {
    const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to proceed with checkout');
            navigate('/login');
            return;
        }

        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (!user) {
            toast.error('User information not available');
            return;
        }

        setIsCheckingOut(true);
        try {
            // Generate order details for email
            const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const orderDate = new Date().toLocaleString();
            
            const orderDetails: OrderDetails = {
                orderId,
                items,
                totalAmount,
                orderDate,
                user
            };

            // Send confirmation emails before clearing cart
            toast.info('Sending confirmation emails...');
            const emailResults = await emailService.sendOrderConfirmationEmails(orderDetails);
            
            if (emailResults.userEmailSent) {
                toast.success('Confirmation email sent to your email address!');
            } else {
                toast.warning(`Failed to send confirmation email: ${emailResults.userMessage}`);
                console.error('User email error:', emailResults.userMessage);
            }

            if (emailResults.adminEmailSent) {
                console.log('Admin notification email sent successfully');
            } else {
                console.warn('Failed to send admin notification email:', emailResults.adminMessage);
                // Don't show user-facing error for admin email failures
            }

            // Simulate checkout process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Clear cart and show success message
            clearCart();
            toast.success('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Checkout failed. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        minHeight: 'calc(100vh - 64px)',
        padding: '40px 20px',
    };

    const headerStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: '40px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '16px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    };

    const contentStyle: React.CSSProperties = {
        maxWidth: '800px',
        margin: '0 auto',
    };

    const emptyCartStyle: React.CSSProperties = {
        textAlign: 'center',
        color: 'white',
        padding: '60px 20px',
    };

    const emptyCartTextStyle: React.CSSProperties = {
        fontSize: '18px',
        marginBottom: '24px',
        opacity: 0.8,
    };

    const cartItemStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
    };

    const itemImageStyle: React.CSSProperties = {
        width: '80px',
        height: '80px',
        objectFit: 'contain',
        borderRadius: '8px',
    };

    const itemDetailsStyle: React.CSSProperties = {
        flex: 1,
    };

    const itemTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '8px',
    };

    const itemPriceStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#3b82f6',
        fontWeight: '600',
    };

    const quantityControlsStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    };

    const quantityButtonStyle: React.CSSProperties = {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid #3b82f6',
        background: 'white',
        color: '#3b82f6',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
    };

    const quantityDisplayStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: '600',
        minWidth: '24px',
        textAlign: 'center',
    };

    const removeButtonStyle: React.CSSProperties = {
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    };

    const summaryStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    };

    const summaryRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    };

    const totalStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        borderTop: '2px solid #e5e7eb',
        paddingTop: '12px',
        marginTop: '12px',
    };

    const checkoutButtonStyle: React.CSSProperties = {
        width: '100%',
        padding: '16px 24px',
        borderRadius: '8px',
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(45deg, #10b981, #059669)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
        marginTop: '16px',
    };

    const continueShoppingStyle: React.CSSProperties = {
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
        textDecoration: 'none',
        display: 'inline-block',
    };

    return (
        <Layout>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <motion.h1
                        style={titleStyle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Shopping Cart
                    </motion.h1>
                </div>

                <div style={contentStyle}>
                    {items.length === 0 ? (
                        <motion.div
                            style={emptyCartStyle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div style={emptyCartTextStyle}>Your cart is empty</div>
                            <motion.button
                                onClick={() => navigate('/products')}
                                style={continueShoppingStyle}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Continue Shopping
                            </motion.button>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.product._id}
                                        style={cartItemStyle}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <img
                                            src={item.product.thumbnail}
                                            alt={item.product.title}
                                            style={itemImageStyle}
                                        />
                                        <div style={itemDetailsStyle}>
                                            <h3 style={itemTitleStyle}>{item.product.title}</h3>
                                            <div style={itemPriceStyle}>
                                                ${(item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2)}
                                            </div>
                                        </div>
                                        <div style={quantityControlsStyle}>
                                            <motion.button
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                                style={quantityButtonStyle}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                -
                                            </motion.button>
                                            <span style={quantityDisplayStyle}>{item.quantity}</span>
                                            <motion.button
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                                style={quantityButtonStyle}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                +
                                            </motion.button>
                                        </div>
                                        <motion.button
                                            onClick={() => removeFromCart(item.product._id)}
                                            style={removeButtonStyle}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Remove
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.div
                                style={summaryStyle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div style={summaryRowStyle}>
                                    <span>Items ({items.length}):</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div style={summaryRowStyle}>
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <div style={{ ...summaryRowStyle, ...totalStyle }}>
                                    <span>Total:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>

                                <motion.button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    style={{
                                        ...checkoutButtonStyle,
                                        opacity: isCheckingOut ? 0.7 : 1,
                                        cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                                    }}
                                    whileHover={!isCheckingOut ? { scale: 1.02 } : {}}
                                    whileTap={!isCheckingOut ? { scale: 0.98 } : {}}
                                >
                                    {isCheckingOut ? 'Processing...' : (isAuthenticated ? 'Place Order' : 'Login to Order')}
                                </motion.button>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Cart;