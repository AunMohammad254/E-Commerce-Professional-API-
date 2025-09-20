import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import Layout from '../components/Layout/Layout';
import { Product, productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';

const AnimatedSphere: React.FC = () => {
    return (
        <Sphere visible args={[1, 100, 200]} scale={2}>
            <MeshDistortMaterial
                color="#3b82f6"
                attach="material"
                distort={0.3}
                speed={1.5}
                roughness={0}
            />
        </Sphere>
    );
};

const Home: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await productAPI.getExternal();
            if (response.data.success) {
                // Get first 6 products as featured
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
        // Convert external product format to internal format
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
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* 3D Background */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <AnimatedSphere />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.h1
                            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow-lg"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Welcome to the
                            <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                                Future of Shopping
                            </span>
                        </motion.h1>
                        
                        <motion.p
                            className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto text-shadow"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Discover amazing products with cutting-edge technology and unbeatable prices
                        </motion.p>
                        
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <Link to="/products">
                                <motion.button
                                    className="btn-3d text-lg px-8 py-4"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Shop Now
                                </motion.button>
                            </Link>
                            <Link to="/about">
                                <motion.button
                                    className="px-8 py-4 rounded-lg font-semibold text-white border-2 border-white/30 hover:border-white/50 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Learn More
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full floating-element"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-500/20 rounded-full floating-element" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-20 w-12 h-12 bg-pink-500/20 rounded-full floating-element" style={{ animationDelay: '4s' }}></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/5 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-shadow">
                            Why Choose Us?
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Experience the difference with our premium features and services
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
                                icon: '🚀',
                                title: 'Fast Delivery',
                                description: 'Lightning-fast shipping to your doorstep'
                            },
                            {
                                icon: '🔒',
                                title: 'Secure Payments',
                                description: 'Your transactions are protected with bank-level security'
                            },
                            {
                                icon: '⭐',
                                title: 'Quality Products',
                                description: 'Curated selection of premium products'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="card-3d p-8 text-center"
                                variants={itemVariants}
                                whileHover={{ y: -10, rotateY: 5 }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-shadow">
                            Featured Products
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Discover our handpicked selection of trending products
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
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
                                    className="card-3d overflow-hidden"
                                    variants={itemVariants}
                                    whileHover={{ y: -10, rotateY: 5 }}
                                >
                                    <div className="aspect-w-16 aspect-h-12">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    ${product.price}
                                                </span>
                                                {product.discountPercentage > 0 && (
                                                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                                                        -{product.discountPercentage}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    {product.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full btn-3d"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Add to Cart
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/products">
                            <motion.button
                                className="btn-3d text-lg px-8 py-4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View All Products
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Home;