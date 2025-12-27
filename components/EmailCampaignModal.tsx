
import React, { useState, useMemo } from 'react';
import { X, Mail, Send, Copy, Info, CheckCircle, User, Building, MapPin, Star } from 'lucide-react';
import { BusinessLead, EmailTemplate } from '../types';

interface EmailCampaignModalProps {
  leads: BusinessLead[];
  onClose: () => void;
}

const DEFAULT_TEMPLATE: EmailTemplate = {
  subject: "Partnership Opportunity for {{name}}",
  body: "Hi Team at {{name}},\n\nI noticed your business in {{address}} and was impressed by your setup. Based on our analysis, your business scored {{score}}/100 for our new self-service kiosk optimization.\n\nQuick Note: {{notes}}\n\nWould you be open to a 5-minute chat about how Posso can help you scale?\n\nBest regards,\nThe Posso Team"
};

export const EmailCampaignModal: React.FC<EmailCampaignModalProps> = ({ leads, onClose }) => {
  const [template, setTemplate] = useState<EmailTemplate>(DEFAULT_TEMPLATE);
  const [copied, setCopied] = useState(false);

  const leadsWithEmail = useMemo(() => 
    leads.filter(l => !!(l.email || l.enrichment?.emailFound)), 
  [leads]);

  const previewLead = leadsWithEmail[0];

  const injectVariables = (text: string, lead?: BusinessLead) => {
    if (!lead) return text;
    return text
      .replace(/{{name}}/g, lead.name)
      .replace(/{{address}}/g, lead.address)
      .replace(/{{score}}/g, lead.enrichment?.leadScore?.toString() || "N/A")
      .replace(/{{notes}}/g, lead.enrichment?.notes || "I love what you're doing with your menu!");
  };

  const handleLaunchCampaign = () => {
    const emails = leadsWithEmail.map(l => l.email || l.enrichment?.emailFound).join(';');
    const subject = encodeURIComponent(template.subject);
    const body = encodeURIComponent(template.body);
    // Note: We use BCC for bulk send to protect privacy
    window.location.href = `mailto:?bcc=${emails}&subject=${subject}&body=${body}`;
  };

  const copyToClipboard = () => {
    const emails = leadsWithEmail.map(l => l.email || l.enrichment?.emailFound).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <Mail className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">OUTREACH CAMPAIGN</h2>
              <p className="text-sm text-slate-500 font-medium">{leadsWithEmail.length} target leads ready</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Email List */}
          <div className="w-1/3 border-r border-slate-100 bg-slate-50/50 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Recipient List</span>
              <button 
                onClick={copyToClipboard}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase"
              >
                {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy Emails'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {leadsWithEmail.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <Mail size={32} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold text-slate-400">NO EMAILS FOUND YET</p>
                </div>
              ) : (
                leadsWithEmail.map(lead => (
                  <div key={lead.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-slate-800 truncate pr-2">{lead.name}</p>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 rounded">
                        {lead.enrichment?.leadScore || '??'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate italic">{lead.email || lead.enrichment?.emailFound}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Template Editor */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mb-6">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject Line</label>
                <input 
                  type="text" 
                  value={template.subject}
                  onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-800"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Email Content</label>
                  <div className="flex gap-2">
                    {['name', 'address', 'score', 'notes'].map(v => (
                      <button 
                        key={v}
                        onClick={() => setTemplate(prev => ({ ...prev, body: prev.body + ` {{${v}}}` }))}
                        className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded hover:bg-indigo-100 hover:text-indigo-600 transition-colors uppercase"
                      >
                        +{v}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  value={template.body}
                  onChange={(e) => setTemplate(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full h-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-600 resize-none leading-relaxed"
                />
              </div>

              {previewLead && (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-tighter rounded-bl-xl">Live Preview</div>
                  <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={14} /> Sample Injected Result
                  </h4>
                  <p className="text-xs font-bold text-amber-900 mb-1">Subject: {injectVariables(template.subject, previewLead)}</p>
                  <div className="text-xs text-amber-800/80 leading-relaxed whitespace-pre-wrap">
                    {injectVariables(template.body, previewLead)}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
              <button 
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLaunchCampaign}
                disabled={leadsWithEmail.length === 0}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
              >
                <Send size={18} strokeWidth={2.5} />
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
