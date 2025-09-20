import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    };

    const formContainerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '400px',
    };

    const cardStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '8px',
        color: '#1f2937',
    };

    const subtitleStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#6b7280',
        marginBottom: '32px',
    };

    const inputGroupStyle: React.CSSProperties = {
        marginBottom: '20px',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '8px',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '16px',
        transition: 'all 0.2s',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const inputFocusStyle: React.CSSProperties = {
        ...inputStyle,
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    };

    const errorStyle: React.CSSProperties = {
        color: '#ef4444',
        fontSize: '14px',
        marginTop: '4px',
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
        marginBottom: '24px',
    };

    const linkStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#6b7280',
    };

    const linkTextStyle: React.CSSProperties = {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '500',
    };

    return (
        <Layout>
            <div style={containerStyle}>
                <motion.div
                    style={formContainerStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={cardStyle}>
                        <h1 style={titleStyle}>Welcome Back</h1>
                        <p style={subtitleStyle}>Sign in to your account</p>

                        <form onSubmit={handleSubmit}>
                            <div style={inputGroupStyle}>
                                <label htmlFor="email" style={labelStyle}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <div style={errorStyle}>{errors.email}</div>
                                )}
                            </div>

                            <div style={inputGroupStyle}>
                                <label htmlFor="password" style={labelStyle}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="Enter your password"
                                />
                                {errors.password && (
                                    <div style={errorStyle}>{errors.password}</div>
                                )}
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    ...buttonStyle,
                                    opacity: isLoading ? 0.7 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                }}
                                whileHover={!isLoading ? { scale: 1.02 } : {}}
                                whileTap={!isLoading ? { scale: 0.98 } : {}}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </motion.button>
                        </form>

                        <div style={linkStyle}>
                            Don't have an account?{' '}
                            <Link to="/register" style={linkTextStyle}>
                                Sign up here
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Login;