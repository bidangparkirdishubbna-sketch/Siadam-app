
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  LogOut,
  LogIn,
  Bell,
  Shield,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Complaint, ComplaintStatus } from './types';
import { sheetsService } from './services/googleSheetsService';

// Components
import Dashboard from './components/StatsOverview';
import ComplaintForm from './components/ComplaintForm';
import ComplaintTable from './components/ComplaintTable';
import DetailModal from './components/DetailModal';
import Login from './components/Login';

const Sidebar = ({ isAdmin, onLogout }: { isAdmin: boolean, onLogout: () => void }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/tambah', label: 'Tambah Aduan', icon: <PlusCircle size={20} /> },
    { path: '/aduan', label: 'Daftar Aduan', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-100 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            S
          </div>
          <div>
            <h1 className="font-bold text-slate-800 leading-none">SIADAM</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sistem Layanan</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-blue-50 text-blue-600 font-bold shadow-sm shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50">
        {isAdmin ? (
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Keluar Admin</span>
          </button>
        ) : (
          <Link 
            to="/login"
            className="flex items-center gap-3 w-full px-4 py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
          >
            <LogIn size={20} />
            <span className="text-sm font-bold">Login Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
};

const Header = ({ isAdmin, onRefresh, isSyncing }: { isAdmin: boolean, onRefresh: () => void, isSyncing: boolean }) => (
  <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between px-10">
    <div>
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        {isAdmin ? 'Mode Administrator' : 'Mode Publik'}
      </h2>
      <p className="text-lg font-bold text-slate-800">
        {isAdmin ? 'Selamat Datang, Admin' : 'Sistem Aduan Masyarakat'}
      </p>
    </div>
    
    <div className="flex items-center gap-6">
      <button 
        onClick={onRefresh}
        className={`p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all ${isSyncing ? 'animate-spin text-blue-600' : ''}`}
        title="Sinkronisasi Data"
      >
        <RefreshCw size={20} />
      </button>
      <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-800">{isAdmin ? 'Admin Utama' : 'Guest User'}</p>
          <p className={`text-[10px] font-bold uppercase ${isAdmin ? 'text-green-500' : 'text-slate-400'}`}>
            {isAdmin ? 'Online' : 'Viewing Only'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
          {isAdmin ? (
            <img src="https://picsum.photos/100/100?random=admin" alt="Admin" />
          ) : (
            <div className="text-slate-400"><Shield size={20} /></div>
          )}
        </div>
      </div>
    </div>
  </header>
);

const MainApp = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('siadam_auth') === 'true';
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      localStorage.setItem('siadam_auth', 'true');
      navigate('/');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('siadam_auth');
    navigate('/');
  };

  const fetchData = async () => {
    setIsSyncing(true);
    const data = await sheetsService.fetchComplaints();
    setComplaints(data);
    setIsLoading(false);
    setIsSyncing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSuccess = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
    setTimeout(fetchData, 2000); 
  };

  const handleUpdateStatus = async (id: string, newStatus: ComplaintStatus) => {
    if (!isAdmin) return;
    setIsSyncing(true);
    const success = await sheetsService.updateStatus(id, newStatus);
    if (success) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? { ...c, status: newStatus } : c));
    }
    setIsSyncing(false);
  };

  const handleUpdateTeam = async (id: string, team: string) => {
    if (!isAdmin) return;
    setIsSyncing(true);
    const success = await sheetsService.updateTeam(id, team);
    if (success) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? { ...c, assignedTeam: team } : c));
    }
    setIsSyncing(false);
  };

  const handleUpdateFollowUp = async (id: string, followUp: string, followUpPhotos?: string[]) => {
    if (!isAdmin) return;
    setIsSyncing(true);
    const success = await sheetsService.updateFollowUp(id, followUp, followUpPhotos);
    if (success) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? { ...c, followUp, followUpPhotoUrls: followUpPhotos || c.followUpPhotoUrls } : c));
    }
    setIsSyncing(false);
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!isAdmin) return;
    
    // Konfirmasi lagi sebelum eksekusi
    setIsSyncing(true);
    const success = await sheetsService.deleteComplaint(id);
    
    if (success) {
      // Update state lokal segera agar UI terasa cepat
      setComplaints(prev => prev.filter(c => String(c.id) !== String(id)));
      // Opsional: fetch ulang setelah delay untuk sinkronisasi ID baris
      setTimeout(fetchData, 3000);
    } else {
      alert("Gagal menghapus data dari server. Silakan coba lagi.");
    }
    setIsSyncing(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={isAdmin} onLogout={handleLogout} />
      <div className="flex-1 ml-64 bg-slate-50">
        <Header isAdmin={isAdmin} onRefresh={fetchData} isSyncing={isSyncing} />
        <main className="p-10 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-medium">Menghubungkan ke Database Spreadsheet...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800">Dashboard Statistik</h2>
                      <p className="text-slate-500 mt-1">Data statistik penanganan aduan masyarakat secara transparan.</p>
                    </div>
                  </div>
                  
                  <Dashboard complaints={complaints} />

                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-800">Laporan Terbaru</h3>
                      <Link to="/aduan" className="text-blue-600 font-bold text-sm hover:underline">Lihat Semua Laporan →</Link>
                    </div>
                    <ComplaintTable 
                      complaints={complaints.slice(0, 5)} 
                      onSelect={setSelectedComplaint}
                      onUpdateStatus={handleUpdateStatus}
                      onUpdateTeam={handleUpdateTeam}
                      onUpdateFollowUp={handleUpdateFollowUp}
                      onDelete={handleDeleteComplaint}
                      isAdmin={isAdmin}
                    />
                  </section>
                </div>
              } />

              <Route path="/tambah" element={
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto py-4">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Kirim Aduan Anda</h2>
                    <p className="text-slate-500 mt-1">Silakan isi formulir di bawah untuk menyampaikan aspirasi atau keluhan Anda.</p>
                  </div>
                  <ComplaintForm onNewComplaint={handleAddSuccess} />
                </div>
              } />
              
              <Route path="/aduan" element={
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Daftar Semua Aduan</h2>
                    <p className="text-slate-500 mt-1">Seluruh laporan masyarakat yang masuk ke dalam sistem kami.</p>
                  </div>
                  <ComplaintTable 
                    complaints={complaints} 
                    onSelect={setSelectedComplaint}
                    onUpdateStatus={handleUpdateStatus}
                    onUpdateTeam={handleUpdateTeam}
                    onUpdateFollowUp={handleUpdateFollowUp}
                    onDelete={handleDeleteComplaint}
                    isAdmin={isAdmin}
                  />
                </div>
              } />

              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>

      <DetailModal 
        complaint={selectedComplaint} 
        onClose={() => setSelectedComplaint(null)} 
      />
    </div>
  );
};

const App = () => (
  <Router>
    <MainApp />
  </Router>
);

export default App;
