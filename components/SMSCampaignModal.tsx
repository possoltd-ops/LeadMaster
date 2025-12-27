
import React, { useState, useMemo } from 'react';
import { X, MessageSquare, Download, Copy, CheckCircle, Phone, Smartphone, User } from 'lucide-react';
import { BusinessLead } from '../types';

interface SMSCampaignModalProps {
  leads: BusinessLead[];
  onClose: () => void;
}

export const SMSCampaignModal: React.FC<SMSCampaignModalProps> = ({ leads, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Filter leads that have a mobile number (UK standard: starts with 07)
  const leadsWithMobile = useMemo(() => 
    leads.filter(l => {
      if (!l.phone) return false;
      const cleanPhone = l.phone.replace(/\s/g, '');
      // Check for 07 or +447 (international format)
      return cleanPhone.startsWith('07') || cleanPhone.startsWith('+447');
    }), 
  [leads]);

  const exportSMSCSV = () => {
    if (leadsWithMobile.length === 0) return;
    const data = leadsWithMobile.map(l => ({
      Name: l.name,
      Phone: l.phone,
      Score: l.enrichment?.leadScore || 'N/A'
    }));
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).map(v => `"${v}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `posso_sms_leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyAllNumbers = () => {
    const numbers = leadsWithMobile.map(l => l.phone).join(', ');
    navigator.clipboard.writeText(numbers);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl h-[70vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl">
              <MessageSquare className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">SMS CAMPAIGN LIST</h2>
              <p className="text-sm text-slate-500 font-medium">{leadsWithMobile.length} mobile contacts found (07 format)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {leadsWithMobile.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Smartphone size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">No mobile numbers detected</p>
              <p className="text-xs mt-1 italic text-center px-8">Only UK mobile numbers starting with 07 or +447 are listed here for SMS compatibility.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {leadsWithMobile.map(lead => (
                <div key={lead.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{lead.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Phone size={12} className="text-emerald-500" />
                        {lead.phone}
                      </div>
                    </div>
                  </div>
                  {lead.enrichment?.leadScore && (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Score</span>
                      <span className="text-sm font-black text-emerald-600">{lead.enrichment.leadScore}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-100 bg-white flex justify-between items-center">
          <button 
            onClick={copyAllNumbers}
            disabled={leadsWithMobile.length === 0}
            className="text-xs font-black text-slate-600 hover:text-indigo-600 flex items-center gap-2 uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {copied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
            {copied ? 'Copied to Clipboard' : 'Copy All Mobile Numbers'}
          </button>
          <button 
            onClick={exportSMSCSV}
            disabled={leadsWithMobile.length === 0}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-200 disabled:opacity-50 transition-all active:scale-95"
          >
            <Download size={18} />
            Export SMS CSV
          </button>
        </div>
      </div>
    </div>
  );
};
