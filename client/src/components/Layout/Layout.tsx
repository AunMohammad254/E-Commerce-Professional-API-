import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            <motion.main
                className={`flex-1 pt-16 ${className}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {children}
            </motion.main>
            
            <Footer />
        </div>
    );
};

export default Layout;