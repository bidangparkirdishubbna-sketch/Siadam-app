
import { Complaint, ComplaintStatus } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

class GoogleSheetsService {
  /**
   * Mengambil semua data aduan dari Spreadsheet
   */
  async fetchComplaints(): Promise<Complaint[]> {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        // Pastikan setiap item memiliki ID. Jika ID dari sheet kosong, gunakan index baris (+2 karena header di baris 1)
        const mappedData: Complaint[] = data.map((item, index) => ({
          ...item,
          id: item.id ? String(item.id) : String(index + 2),
          // Pastikan array tidak pecah jika data dari sheet berupa string dipisahkan titik koma
          photoUrls: typeof item.photoUrls === 'string' ? item.photoUrls.split(';').filter(Boolean) : (Array.isArray(item.photoUrls) ? item.photoUrls : []),
          followUpPhotoUrls: typeof item.followUpPhotoUrls === 'string' ? item.followUpPhotoUrls.split(';').filter(Boolean) : (Array.isArray(item.followUpPhotoUrls) ? item.followUpPhotoUrls : []),
        }));

        const validData = mappedData.filter(item => item.name || item.subject);
        localStorage.setItem('complaints', JSON.stringify(validData));
        return validData;
      }
      
      const local = localStorage.getItem('complaints');
      return local ? JSON.parse(local) : [];
    } catch (error) {
      console.warn("Gagal terhubung ke Google Script, menggunakan data lokal:", error);
      const local = localStorage.getItem('complaints');
      return local ? JSON.parse(local) : [];
    }
  }

  /**
   * Menambah aduan baru ke Spreadsheet
   */
  async addComplaint(complaint: Omit<Complaint, 'id' | 'timestamp'>): Promise<Complaint | null> {
    const newTimestamp = new Date().toISOString();
    const tempId = Math.random().toString(36).substr(2, 9);
    
    const newEntry: Complaint = {
      ...complaint,
      id: tempId,
      timestamp: newTimestamp,
    };

    try {
      const payload = {
        action: 'add',
        data: {
          ...complaint,
          timestamp: newTimestamp,
          photoUrls: complaint.photoUrls.join(';')
        }
      };

      // Menggunakan fetch dengan mode no-cors untuk Apps Script
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Background sync failed:", err));

      const current = await this.getStoredComplaints();
      localStorage.setItem('complaints', JSON.stringify([newEntry, ...current]));
      
      return newEntry;
    } catch (error) {
      console.error("Error adding complaint:", error);
      return null;
    }
  }

  private async getStoredComplaints(): Promise<Complaint[]> {
    const local = localStorage.getItem('complaints');
    return local ? JSON.parse(local) : [];
  }

  /**
   * Update status aduan
   */
  async updateStatus(id: string, newStatus: ComplaintStatus): Promise<boolean> {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateStatus', id: String(id), status: newStatus })
      });

      const current = await this.getStoredComplaints();
      const updated = current.map(c => String(c.id) === String(id) ? { ...c, status: newStatus } : c);
      localStorage.setItem('complaints', JSON.stringify(updated));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update penugasan tim
   */
  async updateTeam(id: string, team: string): Promise<boolean> {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateTeam', id: String(id), team })
      });

      const current = await this.getStoredComplaints();
      const updated = current.map(c => String(c.id) === String(id) ? { ...c, assignedTeam: team } : c);
      localStorage.setItem('complaints', JSON.stringify(updated));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update data tindak lanjut
   */
  async updateFollowUp(id: string, followUp: string, followUpPhotos?: string[]): Promise<boolean> {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ 
          action: 'updateFollowUp', 
          id: String(id), 
          followUp, 
          followUpPhotos: followUpPhotos?.join(';') 
        })
      });

      const current = await this.getStoredComplaints();
      const updated = current.map(c => String(c.id) === String(id) ? { 
        ...c, 
        followUp, 
        followUpPhotoUrls: followUpPhotos || c.followUpPhotoUrls 
      } : c);
      localStorage.setItem('complaints', JSON.stringify(updated));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Menghapus aduan
   */
  async deleteComplaint(id: string): Promise<boolean> {
    try {
      // Pastikan ID dikonversi ke string dan dikirim dalam payload yang benar
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ 
          action: 'delete', 
          id: String(id) 
        })
      });

      // Karena no-cors, kita tidak bisa baca response.ok, tapi kita asumsikan terkirim
      const current = await this.getStoredComplaints();
      const updated = current.filter(c => String(c.id) !== String(id));
      localStorage.setItem('complaints', JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      return false;
    }
  }
}

export const sheetsService = new GoogleSheetsService();
