import emailjs from '@emailjs/browser';
import { CartItem } from '../contexts/CartContext';
import { User } from './api';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID_USER = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_USER || '';
const EMAILJS_TEMPLATE_ID_ADMIN = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_ADMIN || '';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

// Configuration validation
const isEmailJSConfigured = () => {
    const isConfigured = !!(
        EMAILJS_SERVICE_ID && 
        EMAILJS_TEMPLATE_ID_USER && 
        EMAILJS_TEMPLATE_ID_ADMIN && 
        EMAILJS_PUBLIC_KEY &&
        EMAILJS_SERVICE_ID !== 'your_service_id' &&
        EMAILJS_TEMPLATE_ID_USER !== 'your_template_id' &&
        EMAILJS_TEMPLATE_ID_ADMIN !== 'your_admin_template_id' &&
        EMAILJS_PUBLIC_KEY !== 'your_public_key'
    );
    
    if (!isConfigured) {
        console.warn('EmailJS is not properly configured. Please check your environment variables:');
        console.warn('- REACT_APP_EMAILJS_SERVICE_ID:', EMAILJS_SERVICE_ID || 'MISSING');
        console.warn('- REACT_APP_EMAILJS_TEMPLATE_ID_USER:', EMAILJS_TEMPLATE_ID_USER || 'MISSING');
        console.warn('- REACT_APP_EMAILJS_TEMPLATE_ID_ADMIN:', EMAILJS_TEMPLATE_ID_ADMIN || 'MISSING');
        console.warn('- REACT_APP_EMAILJS_PUBLIC_KEY:', EMAILJS_PUBLIC_KEY ? 'SET' : 'MISSING');
        console.warn('Please refer to the setup instructions in src/templates/emailTemplates.md');
    }
    
    return isConfigured;
};

// Initialize EmailJS only if properly configured
if (isEmailJSConfigured()) {
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialized successfully');
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
    }
} else {
    console.warn('EmailJS initialization skipped due to missing configuration');
}

export interface OrderDetails {
    orderId: string;
    items: CartItem[];
    totalAmount: number;
    orderDate: string;
    user: User;
}

// Helper function to retry failed requests
const retryOperation = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    delay: number = 1000
): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt} failed:`, error);
            
            if (attempt <= maxRetries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
    
    throw lastError;
};

// Enhanced error handling function
const handleEmailError = (error: any, context: string): string => {
    console.error(`EmailJS Error in ${context}:`, error);
    
    if (error?.status === 400) {
        return `Email configuration error: Please check your EmailJS settings and template parameters.`;
    } else if (error?.status === 401) {
        return `Email authentication error: Please verify your EmailJS public key.`;
    } else if (error?.status === 404) {
        return `Email template not found: Please check your template IDs in EmailJS dashboard.`;
    } else if (error?.status >= 500) {
        return `Email service temporarily unavailable. Please try again later.`;
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        return `Network error: Please check your internet connection.`;
    } else {
        return `Email delivery failed: ${error?.message || 'Unknown error'}`;
    }
};

export const emailService = {
    // Check if EmailJS is properly configured
    isConfigured: isEmailJSConfigured,
    
    // Test EmailJS configuration
    testConfiguration: async (): Promise<{ success: boolean; message: string }> => {
        if (!isEmailJSConfigured()) {
            return {
                success: false,
                message: 'EmailJS is not properly configured. Please check your environment variables.'
            };
        }
        
        try {
            // Test with minimal parameters
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID_USER,
                { test: 'configuration' },
                EMAILJS_PUBLIC_KEY
            );
            return {
                success: true,
                message: 'EmailJS configuration is working correctly.'
            };
        } catch (error) {
            return {
                success: false,
                message: handleEmailError(error, 'configuration test')
            };
        }
    },

    // Send confirmation email to user
    sendUserConfirmation: async (orderDetails: OrderDetails): Promise<{ success: boolean; message: string }> => {
        if (!isEmailJSConfigured()) {
            const message = 'EmailJS not configured - user confirmation email skipped';
            console.warn(message);
            return { success: false, message };
        }

        try {
            const templateParams = {
                to_email: orderDetails.user.email,
                to_name: orderDetails.user.name,
                order_id: orderDetails.orderId,
                order_date: orderDetails.orderDate,
                total_amount: orderDetails.totalAmount.toFixed(2),
                items_list: orderDetails.items.map(item => 
                    `${item.product.title} (Qty: ${item.quantity}) - $${(item.product.price * (1 - item.product.discountPercentage / 100) * item.quantity).toFixed(2)}`
                ).join('\n'),
                items_count: orderDetails.items.length,
                user_name: orderDetails.user.name,
                user_email: orderDetails.user.email,
                user_phone: orderDetails.user.phone || 'Not provided',
                shipping_address: orderDetails.user.address ? 
                    `${orderDetails.user.address.street}, ${orderDetails.user.address.city}, ${orderDetails.user.address.state} ${orderDetails.user.address.zipCode}, ${orderDetails.user.address.country}` 
                    : 'Not provided'
            };

            console.log('Sending user confirmation email with params:', {
                service: EMAILJS_SERVICE_ID,
                template: EMAILJS_TEMPLATE_ID_USER,
                to: orderDetails.user.email
            });

            const response = await retryOperation(() => 
                emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID_USER,
                    templateParams,
                    EMAILJS_PUBLIC_KEY
                )
            );

            console.log('User confirmation email sent successfully:', response);
            return { success: true, message: 'User confirmation email sent successfully' };
        } catch (error) {
            const message = handleEmailError(error, 'user confirmation');
            return { success: false, message };
        }
    },

    // Send notification email to admin
    sendAdminNotification: async (orderDetails: OrderDetails): Promise<{ success: boolean; message: string }> => {
        if (!isEmailJSConfigured()) {
            const message = 'EmailJS not configured - admin notification email skipped';
            console.warn(message);
            return { success: false, message };
        }

        try {
            const templateParams = {
                to_email: 'aunmohammad254@gmail.com',
                to_name: 'Admin',
                order_id: orderDetails.orderId,
                order_date: orderDetails.orderDate,
                total_amount: orderDetails.totalAmount.toFixed(2),
                items_list: orderDetails.items.map(item => 
                    `${item.product.title} (Qty: ${item.quantity}) - $${(item.product.price * (1 - item.product.discountPercentage / 100) * item.quantity).toFixed(2)}`
                ).join('\n'),
                items_count: orderDetails.items.length,
                customer_name: orderDetails.user.name,
                customer_email: orderDetails.user.email,
                customer_phone: orderDetails.user.phone || 'Not provided',
                shipping_address: orderDetails.user.address ? 
                    `${orderDetails.user.address.street}, ${orderDetails.user.address.city}, ${orderDetails.user.address.state} ${orderDetails.user.address.zipCode}, ${orderDetails.user.address.country}` 
                    : 'Not provided'
            };

            console.log('Sending admin notification email with params:', {
                service: EMAILJS_SERVICE_ID,
                template: EMAILJS_TEMPLATE_ID_ADMIN,
                to: 'aunmohammad254@gmail.com'
            });

            const response = await retryOperation(() => 
                emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID_ADMIN,
                    templateParams,
                    EMAILJS_PUBLIC_KEY
                )
            );

            console.log('Admin notification email sent successfully:', response);
            return { success: true, message: 'Admin notification email sent successfully' };
        } catch (error) {
            const message = handleEmailError(error, 'admin notification');
            return { success: false, message };
        }
    },

    // Send both emails
    sendOrderConfirmationEmails: async (orderDetails: OrderDetails): Promise<{ 
        userEmailSent: boolean; 
        adminEmailSent: boolean;
        userMessage: string;
        adminMessage: string;
    }> => {
        console.log('Starting email confirmation process for order:', orderDetails.orderId);
        
        const [userResult, adminResult] = await Promise.allSettled([
            emailService.sendUserConfirmation(orderDetails),
            emailService.sendAdminNotification(orderDetails)
        ]);

        const userEmailResult = userResult.status === 'fulfilled' ? userResult.value : { success: false, message: 'Failed to send user email' };
        const adminEmailResult = adminResult.status === 'fulfilled' ? adminResult.value : { success: false, message: 'Failed to send admin email' };

        console.log('Email confirmation results:', {
            user: userEmailResult,
            admin: adminEmailResult
        });

        return {
            userEmailSent: userEmailResult.success,
            adminEmailSent: adminEmailResult.success,
            userMessage: userEmailResult.message,
            adminMessage: adminEmailResult.message
        };
    }
};

export default emailService;