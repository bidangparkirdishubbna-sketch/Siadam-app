
import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { sheetsService } from '../services/googleSheetsService';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface Props {
  onNewComplaint: (complaint: Complaint) => void;
}

const ComplaintForm: React.FC<Props> = ({ onNewComplaint }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    subject: '',
    status: ComplaintStatus.NEW,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles: File[] = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file: File) => {
        const isValid = file.size <= 5 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/png');
        if (!isValid) alert(`${file.name} melebihi 5MB atau bukan format JPG/PNG.`);
        return isValid;
      });

      const totalPhotos = [...photos, ...validFiles].slice(0, 3);
      setPhotos(totalPhotos);
      
      const newPreviews = totalPhotos.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject) return alert("Mohon lengkapi semua field wajib.");

    setLoading(true);
    // In a real app, you would upload these files to Google Drive/Storage first
    const mockPhotoUrls = previews.length > 0 ? previews : [];

    const newComplaint = await sheetsService.addComplaint({
      ...formData,
      photoUrls: mockPhotoUrls
    });

    setLoading(false);
    if (newComplaint) {
      alert("Aduan berhasil dikirim ke Spreadsheet!");
      setFormData({
        date: new Date().toISOString().split('T')[0],
        name: '',
        subject: '',
        status: ComplaintStatus.NEW,
      });
      setPhotos([]);
      setPreviews([]);
      onNewComplaint(newComplaint);
    } else {
      alert("Terjadi kesalahan teknis. Namun data mungkin tetap terkirim, silakan cek dashboard.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <Camera size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tambah Aduan Masyarakat</h2>
          <p className="text-slate-500 text-sm">Catat laporan baru secara manual ke dalam sistem.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Aduan</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Pengirim</label>
            <input 
              type="text" 
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-black font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Perihal / Subjek Aduan</label>
          <textarea 
            rows={4}
            placeholder="Jelaskan detail aduan..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-black font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            value={formData.subject}
            onChange={e => setFormData({...formData, subject: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Lampiran Foto (Maksimal 3) - <span className="text-blue-500">Opsional</span></label>
          <div className="mt-2 flex flex-wrap gap-4">
            {previews.map((preview, idx) => (
              <div key={idx} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {photos.length < 3 && (
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload size={20} className="text-slate-400 mb-1" />
                <span className="text-[10px] font-medium text-slate-400">Pilih Foto</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Simpan Data Aduan'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
