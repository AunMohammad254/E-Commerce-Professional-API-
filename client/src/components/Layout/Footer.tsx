import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Contact', href: '/contact' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Safety Center', href: '/safety' },
            { name: 'Community Guidelines', href: '/guidelines' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
        ],
        connect: [
            { name: 'Twitter', href: 'https://twitter.com' },
            { name: 'Facebook', href: 'https://facebook.com' },
            { name: 'Instagram', href: 'https://instagram.com' },
            { name: 'LinkedIn', href: 'https://linkedin.com' },
        ],
    };

    return (
        <footer className="bg-gradient-to-t from-gray-900 to-gray-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            className="flex items-center space-x-2 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <span className="text-white font-bold text-xl">E-Commerce</span>
                        </motion.div>
                        <motion.p
                            className="text-gray-300 mb-6 max-w-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Your one-stop destination for quality products at unbeatable prices. 
                            Experience the future of online shopping with our modern, secure platform.
                        </motion.p>
                        <motion.div
                            className="flex space-x-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {footerLinks.connect.map((link, index) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-sm font-medium">
                                        {link.name.charAt(0)}
                                    </span>
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).slice(0, 3).map(([category, links], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 * (categoryIndex + 3) }}
                        >
                            <h3 className="text-white font-semibold text-lg mb-4 capitalize">
                                {category}
                            </h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter Section */}
                <motion.div
                    className="mt-12 pt-8 border-t border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-white font-semibold text-lg mb-2">
                                Stay Updated
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Subscribe to our newsletter for the latest deals and updates.
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <motion.button
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-r-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                    className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {currentYear} E-Commerce. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        <span className="text-gray-400 text-sm">
                            Made with ❤️ by Aun Abbas
                        </span>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-400 text-sm">
                                All systems operational
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        </footer>
    );
};

export default Footer;