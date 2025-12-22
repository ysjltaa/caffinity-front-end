import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  // Tunggu sampai pengecekan session di AuthContext selesai
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
      </div>
    );
  }

  // Jika tidak terautentikasi (tidak ada token/user)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika halaman butuh akses admin, tapi user bukan admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Jika lolos semua pengecekan
  return children;
};

export default ProtectedRoute;