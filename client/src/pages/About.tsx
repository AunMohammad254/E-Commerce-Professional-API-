import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const About: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
            },
        },
    };

    return (
        <Layout>
            <div className="min-h-screen py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 text-shadow-lg">
                            About Our
                            <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                                E-Commerce Platform
                            </span>
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            We're revolutionizing online shopping with cutting-edge technology, 
                            seamless user experiences, and innovative features that make shopping 
                            more enjoyable and efficient.
                        </p>
                    </motion.div>

                    {/* Mission Section */}
                    <motion.section
                        className="mb-20"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div className="card-3d p-8 lg:p-12" variants={itemVariants}>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    To provide a world-class e-commerce experience that combines 
                                    cutting-edge technology with exceptional customer service, 
                                    making online shopping accessible, secure, and enjoyable for everyone.
                                </p>
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* Features Section */}
                    <motion.section
                        className="mb-20"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 text-shadow">
                            Why Choose Our Platform?
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: '🚀',
                                    title: 'Lightning Fast',
                                    description: 'Optimized performance with instant page loads and seamless navigation.'
                                },
                                {
                                    icon: '🔒',
                                    title: 'Secure & Safe',
                                    description: 'Bank-level security with encrypted transactions and data protection.'
                                },
                                {
                                    icon: '🎨',
                                    title: 'Beautiful Design',
                                    description: 'Modern, responsive design that works perfectly on all devices.'
                                },
                                {
                                    icon: '🛒',
                                    title: 'Smart Shopping',
                                    description: 'Intelligent recommendations and personalized shopping experience.'
                                },
                                {
                                    icon: '📱',
                                    title: 'Mobile First',
                                    description: 'Designed for mobile users with touch-friendly interfaces.'
                                },
                                {
                                    icon: '🌍',
                                    title: 'Global Reach',
                                    description: 'Worldwide shipping and support for international customers.'
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="card-3d p-6 text-center"
                                    variants={itemVariants}
                                    whileHover={{ y: -10, rotateY: 5 }}
                                >
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Technology Stack Section */}
                    <motion.section
                        className="mb-20"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div className="card-3d p-8 lg:p-12" variants={itemVariants}>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                                    Built with Modern Technology
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Our platform is powered by the latest web technologies to ensure 
                                    reliability, scalability, and exceptional performance.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: 'React', icon: '⚛️' },
                                    { name: 'Node.js', icon: '🟢' },
                                    { name: 'MongoDB', icon: '🍃' },
                                    { name: 'TypeScript', icon: '📘' },
                                    { name: 'Express.js', icon: '🚂' },
                                    { name: 'Three.js', icon: '🎮' },
                                    { name: 'Framer Motion', icon: '✨' },
                                    { name: 'JWT', icon: '🔑' }
                                ].map((tech, index) => (
                                    <motion.div
                                        key={index}
                                        className="text-center p-4 bg-white/10 rounded-lg"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className="text-2xl mb-2">{tech.icon}</div>
                                        <div className="text-gray-700 font-semibold">{tech.name}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.section
                        className="text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="card-3d p-8 lg:p-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                                Ready to Experience the Future?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Join thousands of satisfied customers who have discovered 
                                the joy of seamless online shopping with our platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/products">
                                    <motion.button
                                        className="btn-3d text-lg px-8 py-4"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Start Shopping
                                    </motion.button>
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        className="px-8 py-4 rounded-lg font-semibold text-white border-2 border-blue-500 hover:border-blue-400 transition-all duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Create Account
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </Layout>
    );
};

export default About;
