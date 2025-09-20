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
        padding: '12px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const cartBadgeStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-6px',
        right: '-6px',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        fontSize: '11px',
        fontWeight: '600',
        borderRadius: '50%',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
        animation: 'pulse 2s infinite',
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
                    <nav style={{ ...navStyle, display: 'none' }} className="hidden md:flex">
                        <Link to="/" style={navLinkStyle}>Home</Link>
                        <Link to="/products" style={navLinkStyle}>Products</Link>
                        <Link to="/about" style={navLinkStyle}>About</Link>
                        {isAuthenticated && (
                            <Link to="/orders" style={navLinkStyle}>Orders</Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '12px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        }}
                        className="md:hidden"
                        whileHover={{ 
                            scale: 1.05,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <motion.div 
                            style={{ 
                                width: '20px', 
                                height: '2px', 
                                background: 'white',
                                borderRadius: '1px'
                            }}
                            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                        <motion.div 
                            style={{ 
                                width: '20px', 
                                height: '2px', 
                                background: 'white',
                                borderRadius: '1px'
                            }}
                            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <motion.div 
                            style={{ 
                                width: '20px', 
                                height: '2px', 
                                background: 'white',
                                borderRadius: '1px'
                            }}
                            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.button>

                    {/* Right Side Actions */}
                    <div style={actionsStyle}>
                        {/* Cart */}
                        <Link to="/cart" style={{ textDecoration: 'none' }}>
                            <motion.button
                                style={cartButtonStyle}
                                whileHover={{ 
                                    scale: 1.05, 
                                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))'
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                                </svg>
                                {totalItems > 0 && (
                                    <motion.span
                                        style={cartBadgeStyle}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 500, 
                                            damping: 30,
                                            delay: 0.1
                                        }}
                                        whileHover={{ scale: 1.1 }}
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                            backdropFilter: 'blur(20px)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ 
                            duration: 0.3,
                            type: "spring",
                            stiffness: 400,
                            damping: 25
                        }}
                        className="md:hidden"
                    >
                        <motion.div 
                            style={{ padding: '20px 16px' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { to: "/", label: "Home", icon: "🏠" },
                                    { to: "/products", label: "Products", icon: "🛍️" },
                                    { to: "/about", label: "About", icon: "ℹ️" },
                                    ...(isAuthenticated ? [{ to: "/orders", label: "Orders", icon: "📦" }] : [])
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.to}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                                    >
                                        <Link 
                                            to={item.to} 
                                            style={{
                                                ...navLinkStyle,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                transition: 'all 0.3s ease',
                                                fontSize: '16px',
                                                fontWeight: '500',
                                            }}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span style={{ fontSize: '18px' }}>{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                
                                {!isAuthenticated && (
                                    <motion.div 
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            gap: '12px', 
                                            marginTop: '16px',
                                            paddingTop: '16px',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                    >
                                        <Link
                                            to="/login"
                                            style={{
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                textDecoration: 'none',
                                                fontWeight: '500',
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                textAlign: 'center',
                                                transition: 'all 0.3s ease',
                                            }}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                            <motion.button
                                                className="btn-3d"
                                                style={{ fontSize: '14px', width: '100%' }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Sign Up
                                            </motion.button>
                                        </Link>
                                    </motion.div>
                                )}
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;