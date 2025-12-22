import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartApiService } from "../utils/orderService";
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; 

// Fungsi format Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Ikon SVG ---
const HomeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M9 17H15" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 9V13" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 13H15" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CoffeeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M8 12H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <path d="M10 8V12H14V8" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 16H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CartIcon = ({ active = false }) => {
  const { cartCount } = useCart();
  return (
    <div className="relative">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
        <path d="M8 16H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 10V12" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 10V12" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
      {cartCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border border-white shadow-sm">
          {cartCount > 9 ? "9+" : cartCount}
        </div>
      )}
    </div>
  );
};

const ProfileIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="9" r="3" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M6 20C6 16 9 13 12 13C15 13 18 16 18 20" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
    <path d="M14 14L17 17" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L14 14M6 14L14 6" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [menuItems, setMenuItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { API_BASE_URL } = useAuth(); 
  const { addToCart: addToCartContext } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [API_BASE_URL]);

  const fetchProducts = async () => {
    try {
        setFetching(true);
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        const data = await response.json();
        if (data.success) { setMenuItems(data.products); }
    } catch (error) {
        console.error("Error Detail:", error.message);
    } finally {
        setFetching(false);
    }
};

  const categories = [
    { id: "all", name: "All" },
    { id: "coffee", name: "Coffee" },
    { id: "non-coffee", name: "Non-Coffee" },
    { id: "pastries", name: "Pastries" },
    { id: "special", name: "Special" },
  ];

  const searchItems = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return menuItems;
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
        item.category.toLowerCase().includes(lowerQuery)
    );
  };

  const getFilteredItems = () => {
      let items = searchQuery ? searchItems(searchQuery) : menuItems;
      if (activeCategory !== "all") {
          items = items.filter((item) => 
              item.category.toLowerCase().replace(/-/g, '') === activeCategory.toLowerCase().replace(/-/g, '')
          );
      }
      return items;
  };

  const filteredItems = getFilteredItems();

  const addToCart = async (product, qty = 1) => {
    const itemToAdd = {
      id: product.id,
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || product.image,
      description: product.description,
      category: product.category,
      quantity: qty
    };

    addToCartContext(itemToAdd);

    try {
      await cartApiService.addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || product.image,
        quantity: qty,
      });
    } catch (error) {
      console.error("Failed to add item to backend cart:", error);
    }
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => { if (quantity > 1) setQuantity((prev) => prev - 1); };

  const addToCartFromDetail = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, quantity);
    setSuccessMessage(`${quantity} ${selectedProduct.name} ditambahkan!`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    closeProductDetail();
  };

  const quickAddToCart = (product) => {
    addToCart(product, 1);
    setSuccessMessage(`${product.name} ditambahkan!`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const ProductDetailModal = () => {
    if (!selectedProduct || !isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeProductDetail} />
        <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10 animate-slide-up">
          <div className="relative h-72">
            <img src={selectedProduct.image_url || selectedProduct.image || "https://via.placeholder.com/300"} alt={selectedProduct.name} className="w-full h-full object-cover" />
            <button onClick={closeProductDetail} className="absolute top-6 right-6 bg-white/80 backdrop-blur-md rounded-full p-2.5 shadow-lg active:scale-90 transition-transform"><CloseIcon /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedProduct.name}</h2>
              <span className="text-xl font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-xl">{formatRupiah(selectedProduct.price)}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">{selectedProduct.description || "Indulge in our premium crafted blend."}</p>
            
            <div className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <button onClick={decreaseQuantity} className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold shadow-sm active:bg-gray-100 transition-colors">-</button>
                  <span className="text-xl font-black text-gray-900">{quantity}</span>
                  <button onClick={increaseQuantity} className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold shadow-sm active:bg-gray-100 transition-colors">+</button>
               </div>
               <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total Price</p>
                  <p className="text-lg font-black text-amber-900">{formatRupiah(selectedProduct.price * quantity)}</p>
               </div>
            </div>
          </div>
          <div className="p-8 pt-0">
            <button onClick={addToCartFromDetail} className="w-full bg-amber-800 hover:bg-amber-900 text-white py-5 rounded-2xl font-bold shadow-xl shadow-amber-900/20 active:scale-[0.98] transition-all">Add to Cart</button>
          </div>
        </div>
      </div>
    );
  };

  if (fetching) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-amber-100 border-t-amber-800 rounded-full animate-spin mb-4" />
      <p className="text-amber-900 font-bold animate-pulse tracking-wide">Brewing Menu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <ProductDetailModal />
      {showSuccessToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-[60] flex items-center gap-3 animate-fade-in border border-white/10">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
          <span className="text-xs font-bold">{successMessage}</span>
        </div>
      )}

      <header className="px-6 pt-10 pb-6 bg-white rounded-b-[2rem] shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-gray-900">Menu</h1>
        </div>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-amber-700"><SearchIcon /></span>
          <input 
            type="text" 
            placeholder="Search your caffeine fix..." 
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-200 border-2 outline-none transition-all text-sm font-medium" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </header>

      <main className="px-6 mt-4">
        <div className="flex overflow-x-auto gap-3 py-4 no-scrollbar justify-center">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)} 
              className={`px-6 py-2.5 rounded-xl whitespace-nowrap text-xs font-black transition-all duration-300 ${
                activeCategory === cat.id 
                ? "bg-amber-800 text-white shadow-lg shadow-amber-900/20 scale-105" 
                : "bg-white text-gray-400 border border-gray-100 hover:border-amber-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-50 flex flex-col hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
              <div className="relative overflow-hidden rounded-[1.5rem] mb-4">
                <img 
                  src={item.image_url || item.image || "https://via.placeholder.com/150"} 
                  alt={item.name} 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                  <span className="text-amber-900 font-black text-[10px] tracking-tight">{formatRupiah(item.price)}</span>
                </div>
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-1 px-1">{item.name}</h3>
              <p className="text-gray-400 text-xs flex-1 mb-5 px-1 leading-relaxed">{item.description ? item.description.substring(0, 60) + "..." : "Our signature crafted item."}</p>
              
              <div className="flex gap-2 p-1">
                 <button 
                   onClick={() => openProductDetail(item)} 
                   className="flex-[0.4] py-3 text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors border border-amber-100"
                 >
                   Details
                 </button>
                 <button 
                   onClick={() => quickAddToCart(item)} 
                   className="flex-1 bg-amber-800 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-900 shadow-lg shadow-amber-900/10 active:scale-95 transition-all"
                 >
                   + Add
                 </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4">🏜️</div>
            <p className="text-gray-400 font-bold text-sm">No items found.</p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 py-4 z-40">
        <div className="flex justify-around max-w-md mx-auto px-4">
          <Link to="/home" className="flex flex-col items-center text-gray-300 hover:text-amber-800 transition-colors"><HomeIcon /><span className="text-[10px] mt-1 font-bold">Home</span></Link>
          <Link to="/menu" className="flex flex-col items-center text-amber-800"><CoffeeIcon active={true} /><span className="text-[10px] mt-1 font-black">Menu</span></Link>
          <Link to="/cart" className="flex flex-col items-center text-gray-300 hover:text-amber-800 transition-colors"><CartIcon /><span className="text-[10px] mt-1 font-bold">Cart</span></Link>
          <Link to="/profile" className="flex flex-col items-center text-gray-300 hover:text-amber-800 transition-colors"><ProfileIcon /><span className="text-[10px] mt-1 font-bold">Me</span></Link>
        </div>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default function MenuPageWithStyles(props) {
  return <MenuPage {...props} />;
}