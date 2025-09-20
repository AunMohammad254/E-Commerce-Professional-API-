import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI, Order } from '../services/api';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';

const Orders: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getMyOrders();
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="card-3d p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Access Denied
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Please log in to view your orders.
                        </p>
                        <motion.a
                            href="/login"
                            className="btn-3d"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Go to Login
                        </motion.a>
                    </div>
                </div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-shadow">
                                My Orders
                            </h1>
                            <p className="text-xl text-white/90">
                                Track and manage your order history
                            </p>
                        </div>

                        {orders.length === 0 ? (
                            <motion.div
                                className="card-3d p-8 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="text-6xl mb-4">📦</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    No Orders Yet
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You haven't placed any orders yet. Start shopping to see your orders here!
                                </p>
                                <motion.a
                                    href="/products"
                                    className="btn-3d"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Shopping
                                </motion.a>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order, index) => (
                                    <motion.div
                                        key={order._id}
                                        className="card-3d p-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Placed on {formatDate(order.orderDate)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">Items:</h4>
                                            <div className="space-y-2">
                                                {order.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <img
                                                                src={item.product.thumbnail}
                                                                alt={item.product.title}
                                                                className="w-12 h-12 object-contain rounded"
                                                            />
                                                            <div>
                                                                <p className="font-medium text-gray-800">{item.product.title}</p>
                                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-semibold text-gray-800">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t pt-4">
                                            <div className="mb-4 sm:mb-0">
                                                <p className="text-sm text-gray-600">
                                                    <strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ').toUpperCase()}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                            <motion.button
                                                onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                                                className="btn-3d px-4 py-2 text-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {selectedOrder?._id === order._id ? 'Hide Details' : 'View Details'}
                                            </motion.button>
                                        </div>

                                        {selectedOrder?._id === order._id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 pt-4 border-t"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-semibold text-gray-800 mb-2">Shipping Address:</h5>
                                                        <div className="text-sm text-gray-600">
                                                            <p>{order.shippingAddress.street}</p>
                                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                                            <p>{order.shippingAddress.zipCode}</p>
                                                            <p>{order.shippingAddress.country}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-800 mb-2">Order Summary:</h5>
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Subtotal:</span>
                                                                <span>${order.totalAmount.toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Shipping:</span>
                                                                <span>$0.00</span>
                                                            </div>
                                                            <div className="flex justify-between font-semibold text-gray-800">
                                                                <span>Total:</span>
                                                                <span>${order.totalAmount.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
