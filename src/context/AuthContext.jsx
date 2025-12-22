import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://caffinity-be.vercel.app';

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const savedUser = localStorage.getItem('user_data');
      const token = localStorage.getItem('user_token');
      
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk sinkronisasi dengan App.jsx
  const syncAuthEvent = (isLoggedIn) => {
    localStorage.setItem('isAuthenticated', isLoggedIn ? 'true' : 'false');
    // Memicu event agar useEffect di App.jsx berjalan
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        const userData = {
          id: data.user.id,
          name: data.user.full_name || data.user.username,
          email: data.user.email,
          role: data.user.role || 'user',
          phone: data.user.phone || '',
          address: data.user.address || '',
        };
        
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('user_token', data.token);
        
        // --- SINKRONISASI KE APP.JSX ---
        syncAuthEvent(true);
        
        return { success: true, role: userData.role };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Pastikan server backend sudah jalan.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        return await login(userData.email, userData.password);
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_token');
    
    // --- SINKRONISASI KE APP.JSX ---
    syncAuthEvent(false);
    
    navigate('/login');
  };

  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('user_token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      API_BASE_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
};