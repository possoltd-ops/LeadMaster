

import React from 'react';
import { BusinessLead } from '../types';
import { ExternalLink, Phone, MapPin, Star, Cpu, Globe, Trash2, Zap, Mail, AlertTriangle, Instagram, Link as LinkIcon } from 'lucide-react';

interface LeadCardProps {
  lead: BusinessLead;
  onEnrich: (id: string) => void;
  onRemove: (id: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onEnrich, onRemove }) => {
  const isEnriched = lead.status === 'completed';
  const isEnriching = lead.status === 'enriching';
  const email = lead.enrichment?.emailFound || lead.email;
  const instagram = lead.enrichment?.instagramFound;
  const isLowRating = lead.rating !== undefined && lead.rating <= 3;

  return (
    <div className={`
      bg-white rounded-xl shadow-sm border transition-all relative overflow-hidden
      ${isLowRating ? 'border-rose-300 ring-1 ring-rose-100 bg-rose-50/20' : isEnriched ? 'border-indigo-200' : 'border-slate-200'}
    `}>
      {isLowRating && (
        <div className="absolute top-0 right-0 bg-rose-500 text-white px-2 py-1 text-[10px] font-black rounded-bl-lg flex items-center gap-1 z-10">
          <AlertTriangle size={10} /> LOW RATING
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 leading-tight pr-8">{lead.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
              <MapPin size={14} />
              <span className="truncate">{lead.address}</span>
            </div>
          </div>
          <button 
            onClick={() => onRemove(lead.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={14} className="text-indigo-500" />
              <span>{lead.phone}</span>
            </div>
          )}
          {lead.rating !== undefined && (
            <div className={`flex items-center gap-2 text-sm font-bold ${isLowRating ? 'text-rose-600' : 'text-slate-600'}`}>
              <Star size={14} className={isLowRating ? 'text-rose-500 fill-rose-500' : 'text-amber-400 fill-amber-400'} />
              <span>{lead.rating} / 5</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
              <Mail size={14} className="text-indigo-400" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {instagram && (
            <a 
              href={instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-pink-600 hover:underline col-span-2"
            >
              <Instagram size={14} />
              <span className="truncate">Instagram Profile</span>
            </a>
          )}
          {lead.website && (
            <a 
              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-indigo-600 hover:underline col-span-2"
            >
              <Globe size={14} />
              <span className="truncate">{lead.website}</span>
            </a>
          )}
        </div>

        {isEnriched && lead.enrichment && (
          <div className="bg-indigo-50/50 rounded-lg p-3 mb-4 border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{lead.enrichment.businessType}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-500">Lead Score:</span>
                <span className={`text-sm font-bold ${lead.enrichment.leadScore > 70 ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {lead.enrichment.leadScore}/100
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-3 italic">
              "{lead.enrichment.shortSummary}"
            </p>
            <div className="flex gap-2 flex-wrap mb-4">
              {lead.enrichment.idealForKiosk && (
                <span className="px-2 py-1 bg-white border border-indigo-100 text-[10px] font-bold text-indigo-600 rounded-full flex items-center gap-1">
                  <Cpu size={10} /> KIOSK READY
                </span>
              )}
              {lead.enrichment.idealForOnlineOrdering && (
                <span className="px-2 py-1 bg-white border border-indigo-100 text-[10px] font-bold text-indigo-600 rounded-full flex items-center gap-1">
                  <Zap size={10} /> ONLINE READY
                </span>
              )}
            </div>

            {/* Display research URLs extracted from Search grounding */}
            {lead.enrichment.groundingUrls && lead.enrichment.groundingUrls.length > 0 && (
              <div className="mt-2 pt-2 border-t border-indigo-100/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <LinkIcon size={10} /> Grounding Sources
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {lead.enrichment.groundingUrls.slice(0, 3).map((url, idx) => (
                    <a 
                      key={idx}
                      href={url.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-bold text-indigo-600 bg-white border border-indigo-100 px-1.5 py-0.5 rounded-md hover:bg-indigo-600 hover:text-white transition-all max-w-[120px] truncate"
                      title={url.title}
                    >
                      {url.title || 'Source'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          {!isEnriched && (
            <button
              onClick={() => onEnrich(lead.id)}
              disabled={isEnriching}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-all ${
                isEnriching 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
              }`}
            >
              {isEnriching ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  Hunting Contacts...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Enrich & Find Socials
                </>
              )}
            </button>
          )}
          {lead.mapsUrl && (
            <a
              href={lead.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors ${isEnriched ? 'w-10' : 'flex-none'}`}
              title="Open in Maps"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};