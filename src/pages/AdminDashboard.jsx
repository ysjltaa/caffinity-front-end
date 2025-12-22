import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // ✅ Ambil data dan fungsi logout dari Context
  const { user, API_BASE_URL, logout } = useAuth();

  // Ambil data produk saat pertama kali load atau saat API_BASE_URL berubah
  useEffect(() => {
    fetchProducts();
  }, [API_BASE_URL]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const token = localStorage.getItem('user_token');
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setProducts(products.filter(p => p.id !== id));
          alert('Produk berhasil dihapus');
        } else {
          alert(data.message || 'Gagal menghapus produk');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Terjadi kesalahan jaringan saat menghapus');
      }
    }
  };

  // Fungsi Logout khusus Admin
  const handleLogout = () => {
    if (window.confirm('Apakah Anda ingin keluar dari panel Admin?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
               <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-tighter">Panel</span>
            </div>
            <p className="text-gray-600 font-medium">Selamat datang, <span className="text-amber-700">{user?.name}</span>!</p>
            <p className="text-[10px] text-amber-600 mt-1 italic font-mono bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-100">
               ENDPOINT: {API_BASE_URL}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none border-2 border-red-100 text-red-600 px-5 py-3 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95 text-sm"
            >
              Logout
            </button>
            <Link 
              to="/admin/add-product" 
              className="flex-1 md:flex-none bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <span>+</span> Tambah Menu
            </Link>
          </div>
        </div>

        {/* Ringkasan Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Menu Aktif</p>
            <p className="text-4xl font-black text-amber-800">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 opacity-60">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Status Database</p>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xl font-bold text-gray-700 uppercase">Online</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 opacity-40 grayscale">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Penjualan</p>
            <p className="text-4xl font-black text-gray-300">Soon</p>
          </div>
        </div>

        {/* Tabel Produk */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-amber-50/50 border-b border-amber-100">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-amber-900 uppercase">Produk</th>
                  <th className="px-6 py-5 text-xs font-bold text-amber-900 uppercase">Kategori</th>
                  <th className="px-6 py-5 text-xs font-bold text-amber-900 uppercase">Harga</th>
                  <th className="px-6 py-5 text-xs font-bold text-amber-900 uppercase text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-amber-800 font-bold animate-pulse text-sm">Menghubungkan ke Neon...</p>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <p className="text-gray-400 italic">Database kosong. Silakan tambah produk pertama Anda.</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-amber-50/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.image_url || 'https://via.placeholder.com/80'} 
                            alt={product.name}
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-200 group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <p className="font-black text-gray-800 text-base">{product.name}</p>
                            <p className="text-[10px] font-mono text-gray-400">UID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg border border-amber-100 uppercase">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-amber-900 text-lg">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-bold text-xs">
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-bold text-xs"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;