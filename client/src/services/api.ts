import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Only redirect to login for 401 errors if we're not already on auth pages
        // and if it's not an initial auth check
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath === '/login' || currentPath === '/register';
            const isProfileCheck = error.config?.url?.includes('/users/profile');
            
            // Don't redirect if we're on auth pages or if it's an initial profile check
            if (!isAuthPage && !isProfileCheck) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Types
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    role: 'user' | 'admin';
}

export interface Product {
    _id: string;
    id?: number; // For external API compatibility
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    createdBy: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: string;
    user: string;
    items: {
        product: Product;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: 'easypaisa_jazzcash' | 'bank_transfer' | 'cash_on_delivery';
    paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    orderDate: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// Auth APIs
export const authAPI = {
    register: (data: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        address?: any;
    }) => api.post<AuthResponse>('/auth/register', data),
    
    login: (data: { email: string; password: string }) => 
        api.post<AuthResponse>('/auth/login', data),
    
    logout: () => api.post<{ success: boolean; message: string }>('/auth/logout'),
    
    getProfile: () => api.get<{ success: boolean; user: User }>('/users/profile')
};

// User APIs
export const userAPI = {
    getProfile: () => api.get<{ success: boolean; user: User }>('/users/profile'),
    updateProfile: (data: Partial<User>) => 
        api.put<{ success: boolean; message: string; user: User }>('/users/profile', data)
};

// Product APIs
export const productAPI = {
    getAll: (params?: {
        page?: number;
        limit?: number;
        category?: string;
        brand?: string;
        search?: string;
    }) => api.get<{
        success: boolean;
        products: Product[];
        totalPages: number;
        currentPage: number;
        total: number;
    }>('/products', { params }),
    
    getById: (id: string) => api.get<{ success: boolean; product: Product }>(`/products/${id}`),
    
    create: (data: Partial<Product>) => 
        api.post<{ success: boolean; message: string; product: Product }>('/products', data),
    
    update: (id: string, data: Partial<Product>) => 
        api.put<{ success: boolean; message: string; product: Product }>(`/products/${id}`, data),
    
    delete: (id: string) => 
        api.delete<{ success: boolean; message: string }>(`/products/${id}`),
    
    getExternal: () => api.get<{ success: boolean; products: Product[] }>('/products/external')
};

// Order APIs
export const orderAPI = {
    create: (data: {
        items: { product: string; quantity: number }[];
        shippingAddress: any;
        paymentMethod: string;
        paymentDetails?: any;
    }) => api.post<{ success: boolean; message: string; order: Order }>('/orders', data),
    
    getMyOrders: () => api.get<{ success: boolean; orders: Order[] }>('/orders/my-orders'),
    
    getById: (id: string) => api.get<{ success: boolean; order: Order }>(`/orders/${id}`),
    
    updateStatus: (id: string, data: { orderStatus?: string; paymentStatus?: string }) => 
        api.patch<{ success: boolean; message: string; order: Order }>(`/orders/${id}/status`, data)
};

export default api;