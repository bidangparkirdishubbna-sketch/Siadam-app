
import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { STATUS_COLORS, STATUS_ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { QrCode, ArrowUpRight } from 'lucide-react';
import QRPosterModal from './QRPosterModal';

interface Props {
  complaints: Complaint[];
}

const StatsOverview: React.FC<Props> = ({ complaints }) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  
  const stats = {
    total: complaints.length,
    new: complaints.filter(c => c.status === ComplaintStatus.NEW).length,
    processed: complaints.filter(c => c.status === ComplaintStatus.PROCESSED).length,
    done: complaints.filter(c => c.status === ComplaintStatus.DONE).length,
  };

  const chartData = Object.values(ComplaintStatus).map(status => ({
    name: status,
    count: complaints.filter(c => c.status === status).length,
  }));

  const COLORS = ['#3b82f6', '#eab308', '#f97316', '#22c55e', '#ef4444'];

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Kolom Statistik */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Aduan', value: stats.total, color: 'text-slate-600' },
            { label: 'Baru Masuk', value: stats.new, color: 'text-blue-600' },
            { label: 'Diproses', value: stats.processed, color: 'text-yellow-600' },
            { label: 'Selesai', value: stats.done, color: 'text-green-600' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{item.label}</p>
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Kolom Cetak QR - Fitur Baru */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100 relative overflow-hidden group">
          <div className="relative z-10">
            <QrCode className="mb-4 opacity-80" size={32} />
            <h3 className="font-bold text-lg leading-tight mb-2">Promosikan Layanan Aduan</h3>
            <p className="text-xs text-blue-100 mb-4 opacity-80">Cetak poster QR Code untuk ditempel di area publik.</p>
            <button 
              onClick={() => setIsQRModalOpen(true)}
              className="w-full py-2.5 bg-white text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
            >
              Cetak Poster QR <ArrowUpRight size={14} />
            </button>
          </div>
          {/* Dekorasi Background */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[200px]">
        <h3 className="text-sm font-semibold text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
          Distribusi Status Laporan
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      <QRPosterModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};

export default StatsOverview;
