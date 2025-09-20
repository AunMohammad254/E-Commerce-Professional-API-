import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsProfileOpen(false);
    };

    const menuVariants = {
        closed: {
            opacity: 0,
            y: -20,
            scale: 0.95,
        },
        open: {
            opacity: 1,
            y: 0,
            scale: 1,
        },
    };

    const headerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
    };

    const flexStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
    };

    const logoStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
    };

    const logoIconStyle: React.CSSProperties = {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '20px',
    };

    const logoTextStyle: React.CSSProperties = {
        color: 'white',
        fontWeight: 'bold',
        fontSize: '20px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    };

    const navStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
    };

    const navLinkStyle: React.CSSProperties = {
        color: 'rgba(255, 255, 255, 0.9)',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s',
    };

    const actionsStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    };

    const cartButtonStyle: React.CSSProperties = {
        position: 'relative',
        padding: '8px',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        transition: 'background 0.2s',
    };

    const cartBadgeStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        background: '#ef4444',
        color: 'white',
        fontSize: '12px',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <header style={headerStyle}>
            <div style={containerStyle}>
                <div style={flexStyle}>
                    {/* Logo */}
                    <Link to="/" style={logoStyle}>
                        <motion.div
                            style={logoIconStyle}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>E</span>
                        </motion.div>
                        <span style={logoTextStyle}>E-Commerce</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav style={{ ...navStyle, display: window.innerWidth >= 768 ? 'flex' : 'none' }}>
                        <Link to="/" style={navLinkStyle}>Home</Link>
                        <Link to="/products" style={navLinkStyle}>Products</Link>
                        {isAuthenticated && (
                            <Link to="/orders" style={navLinkStyle}>Orders</Link>
                        )}
                    </nav>

                    {/* Right Side Actions */}
                    <div style={actionsStyle}>
                        {/* Cart */}
                        <Link to="/cart" style={{ textDecoration: 'none' }}>
                            <motion.button
                                style={cartButtonStyle}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                                </svg>
                                {totalItems > 0 && (
                                    <motion.span
                                        style={cartBadgeStyle}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </motion.button>
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div style={{ position: 'relative' }}>
                                <motion.button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                    }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                        {user?.name}
                                    </span>
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            style={{
                                                position: 'absolute',
                                                right: 0,
                                                marginTop: '8px',
                                                width: '192px',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '8px',
                                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                            }}
                                            variants={menuVariants}
                                            initial="closed"
                                            animate="open"
                                            exit="closed"
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div style={{ padding: '8px 0' }}>
                                                <Link
                                                    to="/profile"
                                                    style={{
                                                        display: 'block',
                                                        padding: '8px 16px',
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        textDecoration: 'none',
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    style={{
                                                        display: 'block',
                                                        padding: '8px 16px',
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        textDecoration: 'none',
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    My Orders
                                                </Link>
                                                <hr style={{ margin: '8px 0', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
                                                <button
                                                    onClick={handleLogout}
                                                    style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        padding: '8px 16px',
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s',
                                                    }}
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Link
                                    to="/login"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    Login
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        className="btn-3d"
                                        style={{ fontSize: '14px' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Sign Up
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;