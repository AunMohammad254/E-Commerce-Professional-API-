import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, User } from '../services/api';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';

const Profile: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [profileData, setProfileData] = useState<Partial<User>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            if (response.data.success) {
                setProfileData(response.data.user);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (profileData.email && !emailRegex.test(profileData.email)) {
                toast.error('Please enter a valid email address');
                setSaving(false);
                return;
            }

            const response = await userAPI.updateProfile(profileData);
            if (response.data.success) {
                toast.success('Profile updated successfully!');
                setProfileData(response.data.user);
            }
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
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
                            Please log in to view your profile.
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
                        className="max-w-2xl mx-auto"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-shadow">
                                My Profile
                            </h1>
                            <p className="text-xl text-white/90">
                                Manage your personal information and preferences
                            </p>
                        </div>

                        <motion.form
                            onSubmit={handleSubmit}
                            className="card-3d p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {/* Personal Information */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">
                                    Personal Information
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.role || 'user'}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">
                                    Address Information
                                </h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={profileData.address?.street || ''}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={profileData.address?.city || ''}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={profileData.address?.state || ''}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={profileData.address?.zipCode || ''}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={profileData.address?.country || ''}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <motion.button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-3d px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: saving ? 1 : 1.05 }}
                                    whileTap={{ scale: saving ? 1 : 0.95 }}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </motion.button>
                            </div>
                        </motion.form>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
