
import React from 'react';
import { 
  Inbox, 
  RefreshCcw, 
  ExternalLink, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { ComplaintStatus } from './types';

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.NEW]: "bg-blue-100 text-blue-700 border-blue-200",
  [ComplaintStatus.PROCESSED]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [ComplaintStatus.FOLLOW_UP]: "bg-orange-100 text-orange-700 border-orange-200",
  [ComplaintStatus.DONE]: "bg-green-100 text-green-700 border-green-200",
  [ComplaintStatus.REJECTED]: "bg-red-100 text-red-700 border-red-200",
};

export const STATUS_ICONS: Record<ComplaintStatus, React.ReactNode> = {
  [ComplaintStatus.NEW]: <Inbox size={16} />,
  [ComplaintStatus.PROCESSED]: <RefreshCcw size={16} />,
  [ComplaintStatus.FOLLOW_UP]: <ExternalLink size={16} />,
  [ComplaintStatus.DONE]: <CheckCircle2 size={16} />,
  [ComplaintStatus.REJECTED]: <XCircle size={16} />,
};

/**
 * INTEGRASI GOOGLE SPREADSHEET
 * 1. Link Spreadsheet: https://docs.google.com/spreadsheets/d/1lPyTF1gHYPvUmh56SR7nT4JVIdo8kTDEi0mOE9N8iNY/
 * 2. Menggunakan Web App URL dari Apps Script untuk komunikasi data.
 */
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzm4oO5AaU4Bj5-dLnAQ_QGjOHuEcIF8p8YnLGK8GsxZnp43ZB2gJuYQGfCdaFF3z2dFA/exec";
