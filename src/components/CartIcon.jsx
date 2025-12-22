import React from 'react';
import { useCart } from '../context/CartContext';

const CartIcon = ({ active = false }) => {
  const { cartCount } = useCart();

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
      {/* Lingkaran luar */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Bagian atas keranjang */}
      <path
        d="M8 16H16"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Tali keranjang kiri */}
      <path
        d="M10 10V12"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Tali keranjang kanan */}
      <path
        d="M14 10V12"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Badan keranjang */}
      <path
        d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      
      {/* Badge dengan jumlah item - DI DALAM SVG */}
      {cartCount > 0 && (
        <>
          <circle 
            cx="18" 
            cy="6" 
            r="6" 
            fill="#EF4444" 
            stroke="white" 
            strokeWidth="1.5"
          />
          <text 
            x="18" 
            y="8.5" 
            textAnchor="middle" 
            fill="white" 
            fontSize="7" 
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            {cartCount > 9 ? "9+" : cartCount}
          </text>
        </>
      )}
    </svg>
  );
};

export default CartIcon;

