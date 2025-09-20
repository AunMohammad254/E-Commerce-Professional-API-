import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, authAPI } from '../services/api';
import { toast } from 'react-toastify';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        address?: any;
    }) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_AUTHENTICATED'; payload: boolean }
    | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_USER':
            return { 
                ...state, 
                user: action.payload,
                isAuthenticated: !!action.payload,
                isLoading: false
            };
        case 'SET_AUTHENTICATED':
            return { ...state, isAuthenticated: action.payload };
        case 'UPDATE_USER':
            return { 
                ...state, 
                user: state.user ? { ...state.user, ...action.payload } : null 
            };
        default:
            return state;
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is authenticated on app load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await authAPI.getProfile();
            if (response.data.success && response.data.user) {
                dispatch({ type: 'SET_USER', payload: response.data.user });
            } else {
                dispatch({ type: 'SET_USER', payload: null });
            }
        } catch (error) {
            dispatch({ type: 'SET_USER', payload: null });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await authAPI.login({ email, password });
            
            if (response.data.success && response.data.user) {
                dispatch({ type: 'SET_USER', payload: response.data.user });
                toast.success(response.data.message || 'Login successful!');
                return true;
            } else {
                toast.error(response.data.message || 'Login failed');
                return false;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            dispatch({ type: 'SET_LOADING', payload: false });
            return false;
        }
    };

    const register = async (userData: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        address?: any;
    }): Promise<boolean> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await authAPI.register(userData);
            
            if (response.data.success && response.data.user) {
                dispatch({ type: 'SET_USER', payload: response.data.user });
                toast.success(response.data.message || 'Registration successful!');
                return true;
            } else {
                toast.error(response.data.message || 'Registration failed');
                return false;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            dispatch({ type: 'SET_LOADING', payload: false });
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authAPI.logout();
            dispatch({ type: 'SET_USER', payload: null });
            toast.success('Logged out successfully');
        } catch (error) {
            // Even if logout fails on server, clear local state
            dispatch({ type: 'SET_USER', payload: null });
            toast.success('Logged out successfully');
        }
    };

    const updateUser = (userData: Partial<User>) => {
        dispatch({ type: 'UPDATE_USER', payload: userData });
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;