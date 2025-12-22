import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const [cartCount, setCartCount] = useState(0);

  // Update cart count whenever cartItems change
  useEffect(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalItems);
  }, [cartItems]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => (cartItem.product_id || cartItem.id) === (item.product_id || item.id)
      );

      if (existingItemIndex >= 0) {
        // Update quantity jika sudah ada
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + (item.quantity || 1)
        };
        return updatedItems;
      } else {
        // Tambah item baru
        return [...prevItems, { 
          ...item, 
          quantity: item.quantity || 1 
        }];
      }
    });
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity === 0) {
        return prevItems.filter(item => 
          (item.product_id || item.id) !== productId
        );
      }

      return prevItems.map(item =>
        (item.product_id || item.id) === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  // Remove item
  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => (item.product_id || item.id) !== productId)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Set cart items (for backend sync)
  const setCartItemsFromBackend = (items) => {
    setCartItems(items);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      setCartItems: setCartItemsFromBackend
    }}>
      {children}
    </CartContext.Provider>
  );
};