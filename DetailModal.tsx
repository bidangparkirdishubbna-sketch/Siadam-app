
import React from 'react';
import { Complaint } from '../types';
import { STATUS_COLORS, STATUS_ICONS } from '../constants';
// Added Check to the imported icons from lucide-react
import { X, Calendar, User, FileText, Clock, ExternalLink, MessageCircle, Camera, Check, Users } from 'lucide-react';

interface Props {
  complaint: Complaint | null;
  onClose: () => void;
}

const DetailModal: React.FC<Props> = ({ complaint, onClose }) => {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Detail Laporan Aduan</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {complaint.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pengirim</p>
                    <p className="text-lg font-bold text-slate-800">{complaint.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Waktu Lapor</p>
                    <p className="text-sm font-semibold text-slate-800">{complaint.date}</p>
                    <p className="text-[10px] text-slate-400">{complaint.timestamp}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Perihal Aduan</p>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{complaint.subject}</p>
                </div>
              </div>

              {complaint.assignedTeam && (
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tim Penanggung Jawab</p>
                    <p className="text-sm font-bold text-slate-800">{complaint.assignedTeam}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Camera size={14} /> Foto Laporan Awal
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {complaint.photoUrls.length > 0 ? complaint.photoUrls.map((url, idx) => (
                    <a 
                      key={idx} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative h-40 rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                    >
                      <img src={url} alt={`Lampiran ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ExternalLink size={20} className="text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all" />
                      </div>
                    </a>
                  )) : (
                    <div className="col-span-full py-8 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 text-sm font-medium">
                      Tidak ada lampiran foto awal
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageCircle size={14} /> Hasil Tindak Lanjut Petugas
                  </p>
                </div>
                
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 space-y-4">
                  <p className="text-slate-700 font-medium leading-relaxed italic">
                    {complaint.followUp ? complaint.followUp : "Belum ada catatan tindak lanjut dari petugas."}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {complaint.followUpPhotoUrls && complaint.followUpPhotoUrls.length > 0 ? complaint.followUpPhotoUrls.map((url, idx) => (
                      <a 
                        key={idx} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative h-32 rounded-2xl overflow-hidden border border-blue-200 shadow-md"
                      >
                        <img src={url} alt={`Tindak Lanjut ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Check size={20} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </a>
                    )) : (
                      <div className="col-span-full py-4 text-slate-400 text-xs text-center border border-dashed border-blue-200 rounded-xl">
                        Tidak ada lampiran foto tindak lanjut
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Meta */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ringkasan Status</p>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Status Saat Ini</p>
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 w-fit ${STATUS_COLORS[complaint.status]}`}>
                      {STATUS_ICONS[complaint.status]}
                      {complaint.status}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                      <Clock size={12} /> Log Aktivitas
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">Laporan Diterima</p>
                          <p className="text-[9px] text-slate-400">{complaint.timestamp}</p>
                        </div>
                      </div>
                      {complaint.followUp && (
                        <div className="flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Update Tindak Lanjut</p>
                            <p className="text-[9px] text-slate-400">Baru saja</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl text-white">
                <p className="text-sm font-bold mb-2">Catatan Internal</p>
                <p className="text-xs opacity-70 leading-relaxed">
                  Gunakan data ini sebagai bukti otentik penanganan masalah di lapangan. Pastikan koordinat dan waktu sudah sesuai sebelum menutup laporan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
