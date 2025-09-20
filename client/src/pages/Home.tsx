import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Product, productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';

const ParticleBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            ))}
        </div>
    );
};

const Home: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await productAPI.getExternal();
            if (response.data.success) {
                setFeaturedProducts(response.data.products.slice(0, 6));
            }
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
            toast.error('Failed to load featured products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product: Product) => {
        const internalProduct: Product = {
            ...product,
            _id: product.id?.toString() || Math.random().toString(),
            createdBy: 'external',
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        addToCart(internalProduct, 1);
    };

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            toast.success('Thank you for subscribing to our newsletter!');
            setEmail('');
        }
    };

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

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                    <ParticleBackground />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="mb-6"
                            variants={floatingVariants}
                            animate="animate"
                        >
                            <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full mb-4">
                                ✨ Welcome to the Future of E-Commerce
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="block">Discover</span>
                            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Amazing Products
                            </span>
                        </motion.h1>
                        
                        <motion.p
                            className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Experience premium quality products with lightning-fast delivery, 
                            secure payments, and exceptional customer service that exceeds expectations.
                        </motion.p>
                        
                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <Link to="/products">
                                <motion.button
                                    className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden border border-white/20"
                                    whileHover={{ 
                                        scale: 1.05, 
                                        y: -3,
                                        boxShadow: '0 25px 50px rgba(59, 130, 246, 0.3)'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <span className="text-2xl">🛍️</span>
                                        Shop Now
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.button>
                            </Link>
                            <motion.button
                                className="group px-10 py-5 rounded-2xl font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -3,
                                    background: 'rgba(255, 255, 255, 0.15)'
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <span className="text-2xl">📖</span>
                                    Learn More
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            {[
                                { number: "10K+", label: "Happy Customers" },
                                { number: "500+", label: "Products" },
                                { number: "99%", label: "Satisfaction Rate" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                                    <div className="text-white/70">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                    className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
                    variants={floatingVariants}
                    animate="animate"
                />
                <motion.div 
                    className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '1s' }}
                />
                <motion.div 
                    className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '2s' }}
                />
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We're committed to providing you with the best shopping experience through innovative features and exceptional service
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                icon: '🚀',
                                title: 'Lightning Fast Delivery',
                                description: 'Same-day delivery available in major cities with real-time tracking',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: '🔒',
                                title: 'Bank-Level Security',
                                description: 'Your data and payments are protected with military-grade encryption',
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: '⭐',
                                title: 'Premium Quality',
                                description: 'Hand-picked products from trusted brands with quality guarantee',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: '💬',
                                title: '24/7 Support',
                                description: 'Round-the-clock customer service with instant chat support',
                                color: 'from-orange-500 to-red-500'
                            },
                            {
                                icon: '💰',
                                title: 'Best Prices',
                                description: 'Competitive pricing with regular discounts and exclusive deals',
                                color: 'from-indigo-500 to-purple-500'
                            },
                            {
                                icon: '🔄',
                                title: 'Easy Returns',
                                description: 'Hassle-free 30-day return policy with free return shipping',
                                color: 'from-teal-500 to-blue-500'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                                <div className="relative z-10">
                                    <div className="text-5xl mb-6">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                            Trending Products
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover our most popular items loved by thousands of customers worldwide
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {featuredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id || index}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                                    variants={itemVariants}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-full h-64 object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {product.discountPercentage > 0 && (
                                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                -{product.discountPercentage}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {product.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    ${product.price}
                                                </span>
                                            </div>
                                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                                                <span className="text-yellow-500 text-sm">⭐</span>
                                                <span className="text-sm text-gray-700 ml-1 font-medium">
                                                    {product.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => handleAddToCart(product)}
                                            className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden border border-blue-500/20"
                                            whileHover={{ 
                                                scale: 1.02,
                                                y: -2,
                                                boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)'
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <span className="text-lg">🛒</span>
                                                Add to Cart
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/products">
                            <motion.button
                                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden border border-blue-500/20"
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -3,
                                    boxShadow: '0 25px 50px rgba(59, 130, 246, 0.3)'
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <span className="text-2xl">🔍</span>
                                    Explore All Products
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                            What Our Customers Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join thousands of satisfied customers who trust us for their shopping needs
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                name: "Sarah Johnson",
                                role: "Verified Buyer",
                                content: "Amazing quality products and super fast delivery! I've been shopping here for months and never disappointed.",
                                rating: 5,
                                avatar: "👩‍💼"
                            },
                            {
                                name: "Mike Chen",
                                role: "Premium Member",
                                content: "The customer service is outstanding. They helped me with my order and even provided a discount for the inconvenience.",
                                rating: 5,
                                avatar: "👨‍💻"
                            },
                            {
                                name: "Emily Davis",
                                role: "Regular Customer",
                                content: "Best online shopping experience ever! The website is easy to use and the products always arrive in perfect condition.",
                                rating: 5,
                                avatar: "👩‍🎨"
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-lg">⭐</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 italic leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Stay Updated with Latest Deals
                        </h2>
                        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                            Subscribe to our newsletter and be the first to know about exclusive offers, new arrivals, and special discounts
                        </p>
                        
                        <motion.form
                            onSubmit={handleNewsletterSubmit}
                            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                            whileHover={{ scale: 1.02 }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
                                required
                            />
                            <motion.button
                                type="submit"
                                className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                📧 Subscribe
                            </motion.button>
                        </motion.form>
                        
                        <p className="text-white/70 text-sm mt-4">
                            No spam, unsubscribe at any time. We respect your privacy.
                        </p>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Home;