import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRGenerator({ auth }) {
    const [tableNumber, setTableNumber] = useState('');
    const baseUrl = window.location.origin; 
    const generatedUrl = `${baseUrl}/?table=${tableNumber}`;

    const downloadQR = () => {
        const canvas = document.getElementById("qr-gen");
        if (!canvas) return;

        // Gunakan metode Blob untuk proses download yang lebih stabil
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `QR_Alinea_Meja_${tableNumber}.png`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Hapus URL objek dari memori setelah selesai
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="QR Generator - Alinea" />

            <div className="py-12 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header Title */}
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] mb-2 block">Access Point System</span>
                        <h2 className="font-black text-4xl text-zinc-900 tracking-tighter uppercase italic leading-none">
                            QR <span className="text-zinc-300">GENERATOR.</span>
                        </h2>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-zinc-100 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6 w-full">
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Input Nomor Meja</label>
                                <input 
                                    type="number" 
                                    placeholder="Contoh: 01" 
                                    className="w-full bg-zinc-50 border-none rounded-2xl py-5 px-8 mt-2 text-sm font-black focus:ring-2 focus:ring-zinc-900 transition-all shadow-inner"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                />
                            </div>

                            <div className="p-5 bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200">
                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Target URL:</p>
                                <code className="text-[11px] font-bold text-zinc-600 break-all bg-white px-2 py-1 rounded">
                                    {tableNumber ? generatedUrl : 'Menunggu input nomor meja...'}
                                </code>
                            </div>

                            {tableNumber && (
                                <button 
                                    onClick={downloadQR}
                                    className="w-full bg-zinc-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl shadow-zinc-200 hover:bg-zinc-800"
                                >
                                    Download QR PNG (HD)
                                </button>
                            )}
                        </div>

                        {/* QR PREVIEW AREA */}
                        <div className="w-72 h-72 bg-white rounded-[3rem] border border-zinc-100 flex items-center justify-center p-8 shadow-2xl relative">
                            {tableNumber ? (
                                <div className="p-2 bg-white rounded-xl">
                                    <QRCodeCanvas 
                                        id="qr-gen"
                                        value={generatedUrl} 
                                        size={512} // Ukuran canvas besar supaya hasil download tajam
                                        style={{ width: '200px', height: '200px' }} // Tampilan di web tetap 200px
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-zinc-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-2 opacity-20">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                                    </svg>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-10 text-center">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                            Tips: Cetak QR Code ini dan tempelkan di setiap meja.<br/> 
                            Pelanggan yang scan akan otomatis masuk ke menu dengan nomor meja yang sesuai.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}