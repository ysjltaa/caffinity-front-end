import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Tambahkan ini

const AddProductPage = () => {
  const { API_BASE_URL } = useAuth(); // Ambil URL dinamis
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Coffee',
    description: '',
    image_url: '' // Ubah dari file ke string URL
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('user_token');
      
      // Mengirim JSON biasa karena kita menggunakan URL gambar (string)
      const response = await fetch(`${API_BASE_URL}/api/products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: formData.name,
            price: parseFloat(formData.price), // Pastikan angka
            category: formData.category,
            description: formData.description,
            image_url: formData.image_url
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Produk berhasil ditambahkan!');
        navigate('/admin/dashboard'); // Arahkan ke Dashboard Admin
      } else {
        alert(result.error || 'Gagal menambahkan produk');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan jaringan atau server mati');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-3xl mt-10 border border-amber-100">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/dashboard')} className="text-amber-800 font-bold">←</button>
        <h2 className="text-2xl font-bold text-amber-900">Tambah Menu Baru</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Nama Produk</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border-2 border-amber-50 p-3 rounded-xl focus:border-amber-500 outline-none transition-all"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Caramel Macchiato"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Harga (Rp)</label>
            <input
              type="number"
              name="price"
              required
              className="w-full border-2 border-amber-50 p-3 rounded-xl focus:border-amber-500 outline-none transition-all"
              value={formData.price}
              onChange={handleChange}
              placeholder="35000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
            <select
              name="category"
              className="w-full border-2 border-amber-50 p-3 rounded-xl focus:border-amber-500 outline-none transition-all bg-white"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Coffee">Coffee</option>
              <option value="Non-Coffee">Non-Coffee</option>
              <option value="Pastry">Pastry</option>
              <option value="Main Course">Main Course</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
          <textarea
            name="description"
            rows="3"
            className="w-full border-2 border-amber-50 p-3 rounded-xl focus:border-amber-500 outline-none transition-all"
            value={formData.description}
            onChange={handleChange}
            placeholder="Jelaskan detail rasa produk..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">URL Gambar Produk</label>
          <input
            type="text"
            name="image_url"
            className="w-full border-2 border-amber-50 p-3 rounded-xl focus:border-amber-500 outline-none transition-all"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Tempel link gambar (https://...)"
          />
          <p className="text-[10px] text-gray-400 mt-1 ml-1">*Gunakan link gambar dari Pinterest/Unsplash untuk sementara</p>
        </div>

        <div className="pt-4">
            <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-800 hover:bg-amber-900'
            }`}
            >
            {loading ? 'Menyimpan ke Database...' : 'Simpan ke Menu'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;