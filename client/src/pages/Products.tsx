import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { Product, productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productAPI.getExternal();
            if (response.data.success) {
                const productsData = response.data.products.map((product: any) => ({
                    ...product,
                    _id: product.id?.toString() || Math.random().toString(),
                    createdBy: 'external',
                    isDeleted: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }));
                setProducts(productsData);
                
                // Extract unique categories
                const categorySet = new Set(productsData.map((p: Product) => p.category));
                const uniqueCategories = Array.from(categorySet);
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product, 1);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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

    const headerStyle: React.CSSProperties = {
        padding: '40px 20px',
        textAlign: 'center',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '16px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    };

    const subtitleStyle: React.CSSProperties = {
        fontSize: '18px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '32px',
    };

    const filtersStyle: React.CSSProperties = {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '40px',
    };

    const searchInputStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        fontSize: '16px',
        minWidth: '300px',
        outline: 'none',
    };

    const selectStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        fontSize: '16px',
        outline: 'none',
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        padding: '0 20px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const cardStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '200px',
        objectFit: 'contain',
    };

    const contentStyle: React.CSSProperties = {
        padding: '20px',
    };

    const productTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '8px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    };

    const descriptionStyle: React.CSSProperties = {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '16px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    };

    const priceRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    };

    const priceStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#3b82f6',
    };

    const ratingStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '14px',
        color: '#6b7280',
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
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
    };

    const loadingStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'white',
        fontSize: '18px',
    };

    return (
        <Layout>
            <div style={headerStyle}>
                <motion.h1
                    style={titleStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Our Products
                </motion.h1>
                <motion.p
                    style={subtitleStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Discover amazing products at unbeatable prices
                </motion.p>

                <motion.div
                    style={filtersStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={searchInputStyle}
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </motion.div>
            </div>

            {loading ? (
                <div style={loadingStyle}>
                    <div>Loading products...</div>
                </div>
            ) : (
                <motion.div
                    style={gridStyle}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product._id}
                            style={cardStyle}
                            variants={itemVariants}
                            whileHover={{ y: -10, rotateY: 5 }}
                        >
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                style={imageStyle}
                            />
                            <div style={contentStyle}>
                                <h3 style={productTitleStyle}>{product.title}</h3>
                                <p style={descriptionStyle}>{product.description}</p>
                                
                                <div style={priceRowStyle}>
                                    <div>
                                        <span style={priceStyle}>${product.price}</span>
                                        {product.discountPercentage > 0 && (
                                            <span style={{
                                                fontSize: '12px',
                                                color: '#10b981',
                                                background: '#d1fae5',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                marginLeft: '8px',
                                            }}>
                                                -{product.discountPercentage}%
                                            </span>
                                        )}
                                    </div>
                                    <div style={ratingStyle}>
                                        <span>⭐</span>
                                        <span>{product.rating}</span>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={() => handleAddToCart(product)}
                                    style={buttonStyle}
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

            {!loading && filteredProducts.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '18px',
                    padding: '40px',
                }}>
                    No products found matching your criteria.
                </div>
            )}
        </Layout>
    );
};

export default Products;