import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '../services/api';
import { toast } from 'react-toastify';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
}

interface CartContextType extends CartState {
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartItem: (productId: string) => CartItem | undefined;
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
    | { type: 'CLEAR_CART' };

const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => {
        const price = item.product.price * (1 - item.product.discountPercentage / 100);
        return sum + (price * item.quantity);
    }, 0);
    return { totalItems, totalAmount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const { product, quantity } = action.payload;
            const existingItemIndex = state.items.findIndex(
                item => item.product._id === product._id
            );

            let newItems: CartItem[];
            if (existingItemIndex >= 0) {
                // Update existing item
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item
                newItems = [...state.items, { product, quantity }];
            }

            const { totalItems, totalAmount } = calculateTotals(newItems);
            return {
                items: newItems,
                totalItems,
                totalAmount,
            };
        }

        case 'REMOVE_FROM_CART': {
            const newItems = state.items.filter(
                item => item.product._id !== action.payload
            );
            const { totalItems, totalAmount } = calculateTotals(newItems);
            return {
                items: newItems,
                totalItems,
                totalAmount,
            };
        }

        case 'UPDATE_QUANTITY': {
            const { productId, quantity } = action.payload;
            if (quantity <= 0) {
                // Remove item if quantity is 0 or negative
                const newItems = state.items.filter(
                    item => item.product._id !== productId
                );
                const { totalItems, totalAmount } = calculateTotals(newItems);
                return {
                    items: newItems,
                    totalItems,
                    totalAmount,
                };
            }

            const newItems = state.items.map(item =>
                item.product._id === productId
                    ? { ...item, quantity }
                    : item
            );
            const { totalItems, totalAmount } = calculateTotals(newItems);
            return {
                items: newItems,
                totalItems,
                totalAmount,
            };
        }

        case 'CLEAR_CART':
            return {
                items: [],
                totalItems: 0,
                totalAmount: 0,
            };

        default:
            return state;
    }
};

const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalAmount: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = (product: Product, quantity: number = 1) => {
        if (product.stock < quantity) {
            toast.error('Not enough stock available');
            return;
        }

        dispatch({
            type: 'ADD_TO_CART',
            payload: { product, quantity },
        });
        toast.success(`${product.title} added to cart`);
    };

    const removeFromCart = (productId: string) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: productId,
        });
        toast.success('Item removed from cart');
    };

    const updateQuantity = (productId: string, quantity: number) => {
        const item = state.items.find(item => item.product._id === productId);
        if (item && quantity > item.product.stock) {
            toast.error('Not enough stock available');
            return;
        }

        dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { productId, quantity },
        });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Cart cleared');
    };

    const getCartItem = (productId: string): CartItem | undefined => {
        return state.items.find(item => item.product._id === productId);
    };

    const value: CartContextType = {
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItem,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;