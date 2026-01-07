
export enum ComplaintStatus {
  NEW = "Baru Masuk",
  PROCESSED = "Sedang Diproses",
  FOLLOW_UP = "Dalam Tindak Lanjut",
  DONE = "Selesai",
  REJECTED = "Ditolak/Tidak Valid"
}

export interface Complaint {
  id: string; // Row index or unique ID
  date: string;
  name: string;
  subject: string;
  status: ComplaintStatus;
  photoUrls: string[]; // Semicolon separated string in sheet
  timestamp: string;
  followUp?: string; // Textual follow up
  followUpPhotoUrls?: string[]; // Photos for follow up
  assignedTeam?: string; // Tim Tindak Lanjut
}

export interface Statistics {
  total: number;
  new: number;
  processed: number;
  followUp: number;
  done: number;
  rejected: number;
}
