import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Tambah useEffect di sini

export default function Welcome({ categories, products }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({ name: '', table: '' });

    // --- LOGIC QR CODE (AUTO FILL MEJA) ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tableFromUrl = params.get('table');
        if (tableFromUrl) {
            setCustomerInfo(prev => ({ ...prev, table: tableFromUrl }));
        }
    }, []);

    // --- LOGIC KERANJANG ---
    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => {
            const item = prev.find((i) => i.id === productId);
            if (item.quantity === 1) return prev.filter((i) => i.id !== productId);
            return prev.map((i) => (i.id === productId ? { ...i, quantity: i.quantity - 1 } : i));
        });
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // --- LOGIC WHATSAPP ---
    const handleCheckout = () => {
        if (!customerInfo.name || !customerInfo.table) {
            alert("Isi Nama dan Nomor Meja dulu ya, Bro!");
            return;
        }

        const phone = "6285806746297"; 
        let message = `*HALO ALINEA!* \n\nSaya ingin memesan menu berikut:\n`;
        message += `--------------------------\n`;
        message += `👤 *Nama:* ${customerInfo.name}\n`;
        message += `📍 *Meja:* ${customerInfo.table}\n`;
        message += `--------------------------\n\n`;

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}* (x${item.quantity})\n`;
        });

        message += `\n💰 *Total Bayar: Rp ${totalPrice.toLocaleString('id-ID')}*`;
        message += `\n\n_Mohon segera diproses ya, terima kasih!_`;

        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    const filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(p => p.category.slug === selectedCategory);

    return (
        <>
            <Head title="Alinea Smart Order" />
            
            <div className="min-h-screen bg-gray-50 pb-32 font-sans">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-100">
                    <div className="max-w-md mx-auto px-6 py-6 text-center">
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tighter italic">ALINEA.</h1>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] mt-1 font-bold">Smart Ordering System</p>
                    </div>

                    {/* Category Scroll */}
                    <div className="flex overflow-x-auto pb-4 px-4 no-scrollbar gap-2 max-w-md mx-auto">
                        <button onClick={() => setSelectedCategory('all')} className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'bg-zinc-100 text-zinc-500'}`}>Semua</button>
                        {categories.map((cat) => (
                            <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat.slug ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'bg-zinc-100 text-zinc-500'}`}>{cat.name}</button>
                        ))}
                    </div>
                </header>

                <main className="max-w-md mx-auto px-4 mt-8">
                    <div className="grid grid-cols-1 gap-5">
                        {filteredProducts.map((product) => {
                            const cartItem = cart.find(i => i.id === product.id);
                            return (
                                <div key={product.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm flex gap-5 items-center border border-zinc-50">
                                    {/* TAMPILKAN FOTO MENU ASLI */}
                                    <img 
                                        src={product.image_url} 
                                        alt={product.name} 
                                        className="w-20 h-20 bg-zinc-100 rounded-3xl object-cover flex-shrink-0"
                                    />
                                    
                                    <div className="flex-1">
                                        <h3 className="font-extrabold text-zinc-900 text-sm tracking-tight">{product.name}</h3>
                                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-medium">{product.description || 'Racikan istimewa dari Alinea.'}</p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="font-black text-sm text-zinc-900">Rp {product.price.toLocaleString('id-ID')}</span>
                                            
                                            <div className="flex items-center gap-2 bg-zinc-100 rounded-2xl p-1">
                                                {cartItem ? (
                                                    <>
                                                        <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 bg-white shadow-sm rounded-xl flex items-center justify-center text-zinc-900 font-black">-</button>
                                                        <span className="text-xs font-bold px-1">{cartItem.quantity}</span>
                                                        <button onClick={() => addToCart(product)} className="w-8 h-8 bg-zinc-900 shadow-sm rounded-xl flex items-center justify-center text-white font-black">+</button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => addToCart(product)} className="px-5 py-2 bg-zinc-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest active:scale-90 transition-transform">Add</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* Floating Cart Button */}
                {totalItems > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
                        <button 
                            onClick={() => setShowModal(true)}
                            className="w-full bg-zinc-900 text-white py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between px-8 active:scale-95 transition-all"
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] uppercase font-black text-zinc-400 tracking-widest">{totalItems} Item Selected</span>
                                <span className="font-black text-sm">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <span className="font-black text-xs uppercase tracking-[0.2em]">Order Now →</span>
                        </button>
                    </div>
                )}

                {/* Modal Checkout */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
                        <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl animate-slide-up overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-zinc-900 italic tracking-tighter uppercase">Order Summary.</h2>
                                <button onClick={() => setShowModal(false)} className="text-zinc-400 font-bold p-2">Close</button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Siapa Nama Mu?</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Ivan Farrel"
                                        className="w-full bg-zinc-100 border-none rounded-2xl py-4 px-6 mt-1 text-sm font-bold focus:ring-2 focus:ring-zinc-900 transition-all"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Nomor Meja</label>
                                    <input 
                                        type="number" 
                                        placeholder="Scan QR Meja..."
                                        className="w-full bg-zinc-100 border-none rounded-2xl py-4 px-6 mt-1 text-sm font-bold focus:ring-2 focus:ring-zinc-900 transition-all"
                                        value={customerInfo.table}
                                        onChange={(e) => setCustomerInfo({...customerInfo, table: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                className="w-full bg-zinc-900 text-white py-5 rounded-[2rem] mt-8 font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-zinc-200"
                            >
                                Kirim Pesanan Sekarang
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </>
    );
}