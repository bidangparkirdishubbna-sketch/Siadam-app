
import React, { useState, useEffect } from 'react';
import { X, Printer, Download, QrCode, Smartphone, Info, Globe, RefreshCcw, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const QRPosterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [manualUrl, setManualUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Fungsi cerdas untuk mendeteksi URL website saat ini
  const getDetectedUrl = () => {
    // Mengambil origin (https://domainanda.com)
    const origin = window.location.origin;
    // Mengambil pathname (berguna jika di-hosting di sub-folder)
    let pathname = window.location.pathname;
    if (!pathname.endsWith('/')) pathname += '/';
    
    // Format akhir untuk HashRouter ke halaman tambah aduan
    // Hasil: https://nama-app.vercel.app/#/tambah
    return `${origin}${pathname}#/tambah`.replace(/([^:]\/)\/+/g, "$1");
  };

  useEffect(() => {
    if (isOpen) {
      // Selalu refresh URL setiap modal dibuka untuk memastikan link terbaru
      setManualUrl(getDetectedUrl());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const finalUrl = manualUrl || getDetectedUrl();
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(finalUrl)}&color=1d4ed8&margin=15&qzone=1`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLocal = finalUrl.includes('localhost') || finalUrl.includes('127.0.0.1');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex flex-col lg:flex-row h-full">
          
          {/* Sisi Kiri: Poster Preview (Area Cetak) */}
          <div id="printable-poster" className="flex-1 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-12 text-white text-center flex flex-col items-center justify-center space-y-8 print:m-0 print:h-screen print:w-screen print:p-0">
            <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-blue-900/30">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl">S</div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tighter">SIADAM</h2>
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.4em] opacity-80">Sistem Aduan Masyarakat</p>
            </div>

            <div className="bg-white p-6 rounded-[3.5rem] shadow-2xl relative border-8 border-blue-500/10">
              <img src={qrImageUrl} alt="QR Code Aduan" className="w-64 h-64 md:w-72 md:h-72 object-contain" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl border-2 border-white/20">
                Scan untuk Lapor
              </div>
            </div>

            <div className="space-y-3 max-w-sm">
              <p className="text-3xl font-black leading-tight tracking-tight">Suara Anda Adalah Perubahan</p>
              <p className="text-sm text-blue-100 opacity-90 leading-relaxed font-medium">
                Punya keluhan fasilitas umum? Scan barcode ini dan kirim laporan Anda secara instan dan transparan.
              </p>
            </div>

            <div className="pt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              <span>Cepat</span>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <span>Mudah</span>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <span>Digital</span>
            </div>
          </div>

          {/* Sisi Kanan: Pengaturan QR */}
          <div className="w-full lg:w-[420px] bg-slate-50 p-10 flex flex-col border-l border-slate-100">
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Konfigurasi Barcode</h3>
                  <p className="text-xs text-slate-400 font-medium">Verifikasi tujuan scan</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Globe size={16} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Link Aktif (Online)</p>
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      className={`w-full bg-slate-50 border ${isLocal ? 'border-amber-200 focus:ring-amber-500' : 'border-slate-100 focus:ring-blue-500'} rounded-2xl p-4 text-[11px] font-mono text-slate-600 outline-none transition-all resize-none min-h-[110px]`}
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      placeholder="Contoh: https://siadam.vercel.app/#/tambah"
                    />
                    <button 
                      onClick={handleCopy}
                      className="absolute bottom-3 right-3 p-2 bg-white shadow-md border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-90"
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  
                  {isLocal ? (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                      <div className="flex gap-2 items-center text-amber-700 mb-2">
                        <Info size={16} />
                        <p className="text-[11px] font-bold uppercase">Web Masih Offline</p>
                      </div>
                      <p className="text-[10px] text-amber-700/80 leading-relaxed font-medium">
                        Anda sedang membuka aplikasi dari <strong>localhost</strong>. Barcode ini tidak akan jalan jika discan oleh warga. Segera upload ke Vercel/Netlify untuk mendapatkan link publik.
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2 p-4 bg-green-50 rounded-2xl border border-green-100 items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <p className="text-[10px] text-green-700 font-bold uppercase tracking-tight">Website Siap Dipublikasikan</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-3">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Langkah Hosting Gratis</p>
                  <ol className="text-[11px] space-y-2 opacity-90">
                    <li className="flex gap-2">1. Upload semua file ini ke GitHub.</li>
                    <li className="flex gap-2">2. Hubungkan GitHub ke Vercel.com.</li>
                    <li className="flex gap-2">3. Buka link Vercel, lalu cetak ulang QR ini.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <button 
                onClick={handlePrint}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <Printer size={20} /> Cetak Sekarang
              </button>
              <a 
                href={qrImageUrl} 
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
              >
                <Download size={20} /> Download Gambar QR
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-poster, #printable-poster * { visibility: visible; }
          #printable-poster {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex !important;
            border-radius: 0 !important;
            background: linear-gradient(to bottom right, #1d4ed8, #3730a3) !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default QRPosterModal;
