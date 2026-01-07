
import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Login logic sederhana: admin/admin
    if (username === 'admin' && password === 'admin') {
      // Langsung login tanpa delay untuk responsivitas maksimal
      onLogin(true);
    } else {
      setError('Username atau password salah! Gunakan admin / admin.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-blue-100 border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 p-10 text-white text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold">SIADAM</h1>
          <p className="text-blue-100 text-sm mt-1 uppercase tracking-widest font-semibold">Login Management</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in zoom-in duration-200">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Masukkan username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Masukkan password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Masuk ke Sistem'}
          </button>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400 italic">Petunjuk: Gunakan admin / admin</p>
          </div>
        </form>
        
        <div className="px-10 pb-10 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">© 2024 SIADAM - Sistem Laporan Aduan Masyarakat</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
