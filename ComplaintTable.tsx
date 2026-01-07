
import React, { useState, useRef, useEffect } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { STATUS_COLORS, STATUS_ICONS } from '../constants';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, MoreVertical, Pencil, Check, X as CloseIcon, Image as ImageIcon, Upload, Users, Trash2 } from 'lucide-react';

interface Props {
  complaints: Complaint[];
  onSelect: (complaint: Complaint) => void;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
  onUpdateTeam: (id: string, team: string) => void;
  onUpdateFollowUp: (id: string, followUp: string, followUpPhotos?: string[]) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const TEAMS = [
  "Seksi Pendataan, Pengawasan, dan Pembinaan",
  "Seksi Pemungutan"
];

const ComplaintTable: React.FC<Props> = ({ complaints, onSelect, onUpdateStatus, onUpdateTeam, onUpdateFollowUp, onDelete, isAdmin = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingFollowUpId, setEditingFollowUpId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [tempFollowUp, setTempFollowUp] = useState('');
  const [tempFollowUpPhotos, setTempFollowUpPhotos] = useState<string[]>([]);
  const itemsPerPage = 10;
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredData = complaints.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.assignedTeam && c.assignedTeam.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startEditingFollowUp = (complaint: Complaint) => {
    if (!isAdmin) return;
    setEditingFollowUpId(complaint.id);
    setTempFollowUp(complaint.followUp || '');
    setTempFollowUpPhotos(complaint.followUpPhotoUrls || []);
    setOpenMenuId(null);
  };

  const cancelEditing = () => {
    setEditingFollowUpId(null);
    setTempFollowUp('');
    setTempFollowUpPhotos([]);
  };

  const saveFollowUp = (id: string) => {
    onUpdateFollowUp(id, tempFollowUp, tempFollowUpPhotos);
    setEditingFollowUpId(null);
    setTempFollowUp('');
    setTempFollowUpPhotos([]);
  };

  const handleFollowUpPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setTempFollowUpPhotos([url]); 
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus aduan ini? Data akan dihapus secara permanen dari database.")) {
      if (onDelete) onDelete(id);
      setOpenMenuId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-visible">
      {/* Table Header / Filters */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama, perihal, atau tim..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="text-slate-400" size={18} />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
          >
            <option value="All">Semua Status</option>
            {Object.values(ComplaintStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Content - Column Adjusted */}
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="pl-6 pr-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Tanggal</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Pengirim</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perihal</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Status</th>
              <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Tim Penanggung Jawab</th>
              <th className="pl-4 pr-12 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedData.length > 0 ? paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="pl-6 pr-4 py-4 text-sm text-slate-600">
                  {item.date}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-slate-600 line-clamp-2 max-w-xs">{item.subject}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit ${STATUS_COLORS[item.status]}`}>
                    {STATUS_ICONS[item.status]}
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-lg block w-fit ${item.assignedTeam ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-50 text-slate-300 italic'}`}>
                    {item.assignedTeam || "Belum Ditugaskan"}
                  </span>
                </td>
                <td className="pl-4 pr-12 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Mode Edit Cepat Tindak Lanjut - Hanya muncul jika diedit */}
                    {isAdmin && editingFollowUpId === item.id ? (
                      <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl shadow-xl border border-blue-200 absolute right-16 z-[110] w-80 animate-in fade-in slide-in-from-right-4">
                         <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-left mb-1">Update Tindak Lanjut</p>
                         <textarea
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-black min-h-[100px] resize-none"
                          value={tempFollowUp}
                          onChange={(e) => setTempFollowUp(e.target.value)}
                          placeholder="Deskripsi tindakan..."
                          autoFocus
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 cursor-pointer hover:text-blue-600">
                            <Upload size={14} /> Upload Foto
                            <input type="file" className="hidden" accept="image/*" onChange={handleFollowUpPhotoChange} />
                          </label>
                          {tempFollowUpPhotos.length > 0 && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Foto Terpilih</span>}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => saveFollowUp(item.id)} className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700">Simpan</button>
                          <button onClick={cancelEditing} className="px-4 py-2 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-200">Batal</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => onSelect(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {isAdmin && (
                          <div className="relative inline-block text-left" ref={openMenuId === item.id ? menuRef : null}>
                            <button 
                              onClick={() => toggleMenu(item.id)}
                              className={`p-2 rounded-lg transition-all ${openMenuId === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            >
                              <MoreVertical size={18} />
                            </button>
                            
                            {openMenuId === item.id && (
                              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] py-3 text-left origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">Manajemen Laporan</p>
                                
                                <button
                                  onClick={() => startEditingFollowUp(item)}
                                  className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2 transition-colors font-medium"
                                >
                                  <Pencil size={16} /> Edit Tindak Lanjut
                                </button>

                                <div className="px-4 py-2 bg-slate-50 mx-2 rounded-xl my-3">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                    <Users size={12} /> Tugas Tim
                                  </p>
                                  <div className="space-y-1">
                                    {TEAMS.map((team) => (
                                      <button
                                        key={team}
                                        onClick={() => {
                                          onUpdateTeam(item.id, team);
                                          setOpenMenuId(null);
                                        }}
                                        className={`w-full text-left px-2 py-1.5 text-[11px] rounded-lg transition-colors hover:bg-blue-100 ${item.assignedTeam === team ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'}`}
                                      >
                                        {team}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Update Status</p>
                                {Object.values(ComplaintStatus).map(s => (
                                  <button
                                    key={s}
                                    onClick={() => {
                                      onUpdateStatus(item.id, s);
                                      setOpenMenuId(null);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${item.status === s ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-slate-600'}`}
                                  >
                                    <span className={item.status === s ? 'text-blue-600' : 'text-slate-300'}>
                                      {STATUS_ICONS[s]}
                                    </span>
                                    {s}
                                  </button>
                                ))}

                                <div className="mt-2 pt-2 border-t border-slate-100">
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors font-bold"
                                  >
                                    <Trash2 size={16} /> Hapus Aduan
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <Search size={48} className="mb-2 opacity-20" />
                    <p>Tidak ada data aduan yang ditemukan.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> dari <span className="font-semibold text-slate-800">{filteredData.length}</span> data
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium px-4">Halaman {currentPage} dari {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTable;
