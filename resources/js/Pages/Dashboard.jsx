import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
// Chart imports
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({ auth, products, categories }) {
    const { patch } = useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const [timeRange, setTimeRange] = useState('hari');
    
    // State buat Modal Tambah Menu
    const [showAddModal, setShowAddModal] = useState(false);
    const fileInputRef = useRef();

    // Form logic buat tambah menu baru
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        name: '',
        price: '',
        description: '',
        image: null,
    });

    const handleToggle = (id) => {
        patch(route('products.toggle', id), { preserveScroll: true });
    };

    const submitMenu = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
                if(fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    // --- LOGIC CHART DATA ---
    const chartOptions = { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }, 
        scales: { 
            y: { grid: { display: false }, ticks: { display: false }, border: { display: false } }, 
            x: { grid: { display: false }, border: { display: false } } 
        } 
    };
    const statsData = { hari: [12, 19, 3, 5, 2, 8], minggu: [80, 120, 45, 60, 30, 90], tahun: [1200, 1900, 800, 1100, 600, 1500] };
    const chartData = { 
        labels: ['Coffee', 'Non-Coffee', 'Food', 'Snack', 'Pastry', 'Matcha'], 
        datasets: [{ label: 'Pesanan', data: statsData[timeRange], backgroundColor: '#18181b', borderRadius: 12 }] 
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <Head title="Admin Dashboard" />

            <AuthenticatedLayout
                user={auth.user}
                header={null} // Kita set null karena kita pake custom header di bawah
            >
                <div className="py-12 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        
                        {/* CUSTOM HEADER DENGAN TEMA ALINEA */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 px-4 sm:px-0 gap-4">
                            <div>
                                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] mb-2 block">Management System</span>
                                <h2 className="font-black text-5xl text-zinc-900 tracking-tighter uppercase italic leading-none">
                                    ALINEA <span className="text-zinc-300">STATS.</span>
                                </h2>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => { clearErrors(); setShowAddModal(true); }}
                                    className="bg-zinc-900 text-white px-8 py-4 rounded-[2rem] text-[10px] font-black tracking-widest uppercase hover:shadow-2xl hover:shadow-zinc-300 transition-all active:scale-95"
                                >
                                    + Add New Menu
                                </button>
                            </div>
                        </div>

                        {/* CHART SECTION */}
                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-zinc-100 mb-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="font-black text-zinc-900 uppercase tracking-tighter text-lg italic">Statistik Pesanan</h3>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Kategori Terlaris</p>
                                </div>
                                <div className="flex bg-zinc-100 p-1.5 rounded-2xl gap-1">
                                    {['hari', 'minggu', 'tahun'].map((range) => (
                                        <button 
                                            key={range} 
                                            onClick={() => setTimeRange(range)} 
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${timeRange === range ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-64">
                                <Bar options={chartOptions} data={chartData} />
                            </div>
                        </div>

                        {/* Search & Stats Card */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="md:col-span-2">
                                <input 
                                    type="text" 
                                    placeholder="Cari menu di gudang..." 
                                    className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-zinc-900 transition-all" 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="bg-zinc-900 p-6 rounded-[2rem] flex flex-col justify-center">
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Tersedia</span>
                                <span className="text-2xl font-black text-white">{products.filter(p => p.is_available).length} Menu</span>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 flex flex-col justify-center shadow-sm">
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Sold Out</span>
                                <span className="text-2xl font-black text-red-500">{products.filter(p => !p.is_available).length} Menu</span>
                            </div>
                        </div>

                        {/* Table Menu */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-[3rem] border border-zinc-100 relative z-10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-50 bg-zinc-50/30">
                                            <th className="py-6 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center w-24">Foto</th>
                                            <th className="py-6 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Menu</th>
                                            <th className="py-6 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Kategori</th>
                                            <th className="py-6 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Harga</th>
                                            <th className="py-6 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                                                <td className="py-6 px-8 text-center">
                                                    <img 
                                                        src={product.image_url} 
                                                        alt={product.name} 
                                                        className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-sm border border-zinc-100"
                                                    />
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="font-black text-zinc-900 text-sm">{product.name}</div>
                                                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter line-clamp-1">{product.description || '-'}</div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <span className="text-xs font-bold text-zinc-500 uppercase bg-zinc-100 px-3 py-1 rounded-lg">
                                                        {product.category?.name}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-4 font-black text-sm">Rp {product.price.toLocaleString('id-ID')}</td>
                                                <td className="py-6 px-8 text-right">
                                                    <button 
                                                        onClick={() => handleToggle(product.id)} 
                                                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${product.is_available ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-500 hover:bg-red-200'}`}
                                                    >
                                                        {product.is_available ? 'Available' : 'Sold Out'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            {/* MODAL TAMBAH MENU */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-slide-up relative overflow-y-auto max-h-[90vh] no-scrollbar">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Racikan Baru.</h2>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Nambahin Menu Baru ke Alinea</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-zinc-400 font-bold hover:text-red-500 transition-colors text-xl">✕</button>
                        </div>
                        
                        <form onSubmit={submitMenu} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-wider">Nama Menu</label>
                                <input type="text" placeholder="Contoh: Sea Salt Latte" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 mt-1.5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all" value={data.name} onChange={(e) => setData('name', e.target.value)} required/>
                                {errors.name && <div className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.name}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-wider">Kategori</label>
                                    <select className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 mt-1.5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all appearance-none" value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} required>
                                        <option value="">Pilih...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    {errors.category_id && <div className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.category_id}</div>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-wider">Harga (Rp)</label>
                                    <input type="number" placeholder="Contoh: 35000" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 mt-1.5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all" value={data.price} onChange={(e) => setData('price', e.target.value)} required/>
                                    {errors.price && <div className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.price}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-wider">Deskripsi (Opsional)</label>
                                <textarea placeholder="Deskripsi menu..." className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 mt-1.5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all h-24 resize-none" value={data.description} onChange={(e) => setData('description', e.target.value)}></textarea>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-wider">Foto Menu (Max 2MB)</label>
                                <div className="mt-1.5 flex items-center justify-center w-full bg-zinc-50 border-2 border-zinc-100 border-dashed rounded-3xl p-6 text-center hover:border-zinc-300 transition-colors group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                    {data.image ? (
                                        <div className="flex flex-col items-center">
                                            <img src={URL.createObjectURL(data.image)} className="w-20 h-20 rounded-2xl object-cover mb-2 shadow-md"/>
                                            <span className="text-xs font-bold text-zinc-900 line-clamp-1">{data.image.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p className="text-xs font-bold text-zinc-500">Klik untuk upload foto</p>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => setData('image', e.target.files[0])}/>
                            </div>

                            <button type="submit" disabled={processing} className="w-full bg-zinc-900 text-white py-5 rounded-2xl mt-6 font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50">
                                {processing ? 'Nyimpen...' : 'Simpan Menu Baru'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </>
    );
}