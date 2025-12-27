
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Download, Trash2, Zap, LayoutGrid, List, Loader2, ChevronRight, Navigation, Mail, Map as MapIcon, Sparkles, Megaphone, Smartphone, MessageSquare, Play, Globe, ChevronDown, ChevronUp, Layout, AlertCircle } from 'lucide-react';
import { GeminiService } from './services/geminiService';
import { BusinessLead } from './types';
import { LeadCard } from './components/LeadCard';
import { EmailCampaignModal } from './components/EmailCampaignModal';
import { SMSCampaignModal } from './components/SMSCampaignModal';
import { TeyaLandingPage } from './components/TeyaLandingPage';

const gemini = new GeminiService();

const QUICK_PICK_REGIONS = [
  // Major Cities
  'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Bristol', 'Leeds', 'Sheffield', 'Edinburgh', 'Cardiff', 'Belfast',
  'Leicester', 'Nottingham', 'Newcastle', 'Southampton', 'Portsmouth', 'Aberdeen', 'Swansea', 'Oxford', 'Cambridge', 'Brighton', 'Norwich',
  'Hull', 'Plymouth', 'Stoke-on-Trent', 'Wolverhampton', 'Derby', 'Coventry', 'Reading', 'Milton Keynes', 'York', 'Bath', 'Exeter', 'Chester',
  'Dundee', 'Gloucester', 'Inverness', 'Lancaster', 'Lincoln', 'Newport', 'Preston', 'Salisbury', 'St Albans', 'Sunderland', 'Truro', 'Wakefield', 'Winchester', 'Worcester',
  // Major Counties
  'Leicestershire', 'Nottinghamshire', 'Kent', 'Essex', 'Surrey', 'Hertfordshire', 'Cornwall', 'Devon', 'Hampshire', 'Yorkshire', 'Lancashire',
  'Merseyside', 'Cheshire', 'Staffordshire', 'Warwickshire', 'Worcestershire', 'Shropshire', 'Somerset', 'Dorset', 'Wiltshire', 'Berkshire',
  'Sussex', 'Norfolk', 'Suffolk', 'Cumbria', 'Durham'
];

// Thresholds for Gemini API Free Tier (Approximate)
const MAX_SESSION_REQUESTS = 50; // Safety limit to warn user
const WARNING_THRESHOLD = 35;

interface TownStatus {
  name: string;
  status: 'idle' | 'searching' | 'found' | 'empty';
  count: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'landing'>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [towns, setTowns] = useState<TownStatus[]>([]);
  const [isScoutingCity, setIsScoutingCity] = useState(false);
  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingAll, setIsSearchingAll] = useState(false);
  const [isBulkEnriching, setIsBulkEnriching] = useState(false);
  const [enrichProgress, setEnrichProgress] = useState({ current: 0, total: 0 });
  const [searchStatus, setSearchStatus] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | undefined>();
  const [filterType, setFilterType] = useState<string>('all');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [showAllQuickPicks, setShowAllQuickPicks] = useState(false);
  
  // Quota Tracking
  const [apiRequests, setApiRequests] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn("Location permission denied")
      );
    }
  }, []);

  const trackRequest = () => setApiRequests(prev => prev + 1);

  const scoutCityTowns = async (e?: React.FormEvent, overrideCity?: string) => {
    if (e) e.preventDefault();
    const targetCity = overrideCity || cityInput;
    if (!targetCity.trim()) return;
    
    setIsScoutingCity(true);
    setSearchStatus(`Identifying areas, towns and villages in ${targetCity}...`);
    try {
      trackRequest();
      const result = await gemini.getTowns(targetCity);
      setTowns(result.map(name => ({ name, status: 'idle', count: 0 })));
      setSearchStatus(`Found ${result.length} scouting zones in ${targetCity}.`);
    } catch (err) {
      console.error(err);
      setSearchStatus('Failed to find towns. Try a broader city or county name.');
    } finally {
      setIsScoutingCity(false);
    }
  };

  const handleQuickPick = (region: string) => {
    setCityInput(region);
    scoutCityTowns(undefined, region);
  };

  const searchInTown = async (townName: string) => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term first (e.g. 'Coffee shops')");
      return;
    }

    setTowns(prev => prev.map(t => t.name === townName ? { ...t, status: 'searching' } : t));
    setIsSearching(true);
    setSearchStatus(`Scouting ${searchTerm} in ${townName}...`);

    try {
      trackRequest();
      const results = await gemini.searchLeads(searchTerm, `${townName}, ${cityInput}`, location);
      
      const newLeads = results.leads.filter(newL => 
        !leads.some(existingL => existingL.name === newL.name && existingL.address === newL.address)
      );

      setLeads(prev => [...newLeads, ...prev]);
      
      setTowns(prev => prev.map(t => t.name === townName ? { 
        ...t, 
        status: results.leads.length > 0 ? 'found' : 'empty',
        count: results.leads.length 
      } : t));

      setSearchStatus(`Added ${newLeads.length} leads from ${townName}.`);
      return newLeads.length;
    } catch (err) {
      console.error(err);
      setTowns(prev => prev.map(t => t.name === townName ? { ...t, status: 'empty' } : t));
      return 0;
    } finally {
      setIsSearching(false);
    }
  };

  const searchAllAreas = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term first.");
      return;
    }

    const idleTowns = towns.filter(t => t.status === 'idle');
    if (idleTowns.length === 0) return;

    setIsSearchingAll(true);
    let totalAdded = 0;
    
    for (const town of idleTowns) {
      setSearchStatus(`Processing ${town.name}...`);
      const added = await searchInTown(town.name);
      totalAdded += (added || 0);
      await new Promise(r => setTimeout(r, 1200)); // Slightly increased delay for rate limits
    }

    setIsSearchingAll(false);
    setSearchStatus(`Bulk search complete. Added ${totalAdded} new leads across the region.`);
  };

  const handleEnrich = async (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'enriching' } : l));
    try {
      trackRequest();
      const leadToEnrich = leads.find(l => l.id === id);
      if (!leadToEnrich) return;
      const enrichment = await gemini.enrichLead(leadToEnrich);
      setLeads(prev => prev.map(l => l.id === id ? { 
        ...l, 
        status: 'completed', 
        enrichment,
        email: enrichment.emailFound || l.email
      } : l));
    } catch (err) {
      console.error(err);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'failed' } : l));
    }
  };

  const handleEnrichAll = async () => {
    const unenriched = leads.filter(l => l.status === 'new');
    if (unenriched.length === 0) return;

    setIsBulkEnriching(true);
    setEnrichProgress({ current: 0, total: unenriched.length });
    setSearchStatus(`Enriching ${unenriched.length} leads with Socials & Emails...`);

    let count = 0;
    for (const lead of unenriched) {
      await handleEnrich(lead.id);
      count++;
      setEnrichProgress(prev => ({ ...prev, current: count }));
      await new Promise(r => setTimeout(r, 1000)); // Rate limit buffer
    }

    setIsBulkEnriching(false);
    setSearchStatus(`Finished hunting contacts for ${count} leads.`);
  };

  const clearLeads = () => {
    if (confirm('Clear all gathered leads?')) {
      setLeads([]);
      setTowns([]);
      setSearchStatus('Workspace cleared.');
    }
  };

  const exportLeads = () => {
    if (leads.length === 0) return;
    const data = leads.map(l => ({
      Name: l.name,
      Address: l.address,
      Phone: l.phone || '',
      Email: l.email || l.enrichment?.emailFound || '',
      Instagram: l.enrichment?.instagramFound || '',
      Website: l.website || '',
      Rating: l.rating || '',
      Type: l.enrichment?.businessType || '',
      Score: l.enrichment?.leadScore || '',
      KioskReady: l.enrichment?.idealForKiosk ? 'Yes' : 'No',
      OnlineReady: l.enrichment?.idealForOnlineOrdering ? 'Yes' : 'No',
      Summary: l.enrichment?.shortSummary || ''
    }));
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).map(v => `"${v}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `posso_leads_${cityInput || 'scout'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => {
    if (filterType === 'all') return true;
    if (filterType === 'enriched') return l.status === 'completed';
    if (filterType === 'with-email') return !!(l.email || l.enrichment?.emailFound);
    return true;
  });

  const unenrichedCount = leads.filter(l => l.status === 'new').length;
  const emailCount = leads.filter(l => !!(l.email || l.enrichment?.emailFound)).length;
  const phoneCount = leads.filter(l => !!l.phone && l.phone.replace(/\s/g, '').includes('07')).length;

  const displayedQuickPicks = showAllQuickPicks ? QUICK_PICK_REGIONS : QUICK_PICK_REGIONS.slice(0, 15);

  const quotaColor = apiRequests >= MAX_SESSION_REQUESTS ? 'text-rose-600' : apiRequests >= WARNING_THRESHOLD ? 'text-amber-500' : 'text-slate-500';

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Fixed: TypeScript comparison error by widening literal type during check */}
      {(activeTab as string) === 'landing' ? (
        <TeyaLandingPage />
      ) : (
        <>
          <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Zap className="text-indigo-600 fill-indigo-600" size={24} />
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">POSSO MASTER</h1>
                </div>
                <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setActiveTab('leads')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${activeTab === 'leads' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Lead Hunting
                  </button>
                  <button 
                    onClick={() => setActiveTab('landing')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all flex items-center gap-2 ${activeTab === 'landing' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Layout size={14} /> Teya Landing Page
                  </button>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                 <div className="hidden lg:flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold">
                    <Navigation size={12} className={location ? "text-emerald-500" : ""} />
                    {location ? "GPS LOCKED" : "GPS SCANNING"}
                  </div>
                {leads.length > 0 && (
                  <button onClick={exportLeads} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    <Download size={16} /> Export CSV
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Search Config */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Step 1: Define Target</h2>
                    {apiRequests >= WARNING_THRESHOLD && (
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 animate-pulse">
                        <AlertCircle size={12} /> LIMITS NEAR
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">WHAT TO FIND?</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="e.g. Restaurants" 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                        />
                      </div>
                    </div>
                    <form onSubmit={scoutCityTowns}>
                      <label className="block text-xs font-bold text-slate-500 mb-1">CITY OR COUNTY?</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text" 
                            placeholder="e.g. Leicestershire" 
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={isScoutingCity || !cityInput}
                          className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
                        >
                          {isScoutingCity ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
                        </button>
                      </div>
                    </form>

                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Globe size={10} /> UK Region Quick Pick
                        </label>
                        <button 
                          onClick={() => setShowAllQuickPicks(!showAllQuickPicks)}
                          className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-1"
                        >
                          {showAllQuickPicks ? <><ChevronUp size={10} /> Less</> : <><ChevronDown size={10} /> All Cities</>}
                        </button>
                      </div>
                      <div className={`flex flex-wrap gap-1.5 transition-all duration-300 ${showAllQuickPicks ? 'max-h-[400px] overflow-y-auto pr-1' : 'max-h-[120px] overflow-hidden'}`}>
                        {displayedQuickPicks.map((region) => (
                          <button
                            key={region}
                            onClick={() => handleQuickPick(region)}
                            disabled={isScoutingCity}
                            className="px-2 py-1 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-500 rounded-md text-[10px] font-bold transition-all border border-slate-200"
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-full">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Step 2: Scouting Zones</h2>
                      {towns.length > 0 && <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{towns.length} areas</span>}
                    </div>
                    {towns.some(t => t.status === 'idle') && (
                      <button 
                        onClick={searchAllAreas}
                        disabled={isSearching || isSearchingAll || !searchTerm || apiRequests >= MAX_SESSION_REQUESTS}
                        className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all disabled:opacity-50 border border-indigo-200 shadow-sm"
                      >
                        {isSearchingAll ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                        {apiRequests >= MAX_SESSION_REQUESTS ? 'Rate Limited' : 'Scout All Zones'}
                      </button>
                    )}
                  </div>
                  
                  {towns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <MapIcon size={48} strokeWidth={1} className="mb-2 opacity-20" />
                      <p className="text-sm font-medium">Enter a region to discover towns and villages</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {towns.map((town) => (
                        <button
                          key={town.name}
                          onClick={() => searchInTown(town.name)}
                          disabled={town.status === 'searching' || isBulkEnriching || isSearchingAll || apiRequests >= MAX_SESSION_REQUESTS}
                          className={`
                            px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm
                            ${town.status === 'idle' ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' : ''}
                            ${town.status === 'searching' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse' : ''}
                            ${town.status === 'found' ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200' : ''}
                            ${town.status === 'empty' ? 'bg-rose-500 text-white border-rose-600 shadow-rose-200' : ''}
                            ${(isBulkEnriching || isSearchingAll || apiRequests >= MAX_SESSION_REQUESTS) ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {town.status === 'searching' && <Loader2 size={12} className="animate-spin" />}
                          {town.name}
                          {town.status === 'found' && <span className="ml-1 bg-white/20 px-1.5 rounded-md text-[10px]">{town.count}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dashboard Tools */}
            {leads.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filterType === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>All ({leads.length})</button>
                  <button onClick={() => setFilterType('with-email')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${filterType === 'with-email' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}><Mail size={12} /> Emails ({emailCount})</button>
                  <button onClick={() => setFilterType('enriched')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filterType === 'enriched' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>Analyzed</button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => setIsCampaignModalOpen(true)}
                      disabled={emailCount === 0}
                      className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 hover:bg-indigo-100 disabled:opacity-50 transition-all border border-transparent"
                      title="Email Outreach"
                    >
                      <Mail size={14} /> Email ({emailCount})
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button 
                      onClick={() => setIsSMSModalOpen(true)}
                      disabled={phoneCount === 0}
                      className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 hover:bg-emerald-100 disabled:opacity-50 transition-all border border-transparent"
                      title="SMS Campaign"
                    >
                      <MessageSquare size={14} /> SMS ({phoneCount})
                    </button>
                  </div>

                  <div className="h-8 w-px bg-slate-200 mx-1"></div>
                  <button 
                    onClick={handleEnrichAll} 
                    disabled={isBulkEnriching || unenrichedCount === 0 || apiRequests >= MAX_SESSION_REQUESTS}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-2 transition-all border
                      ${isBulkEnriching 
                        ? 'bg-amber-100 text-amber-700 border-amber-200 cursor-not-allowed' 
                        : (unenrichedCount > 0 && apiRequests < MAX_SESSION_REQUESTS)
                          ? 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'}
                    `}
                  >
                    {isBulkEnriching ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Hunting {enrichProgress.current}/{enrichProgress.total}
                      </>
                    ) : apiRequests >= MAX_SESSION_REQUESTS ? (
                      <>
                        <AlertCircle size={14} />
                        Limit Reached
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} fill="currentColor" />
                        Hunt Socials ({unenrichedCount})
                      </>
                    )}
                  </button>
                  <button onClick={clearLeads} disabled={isBulkEnriching} className="bg-white text-rose-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 border border-slate-200 transition-colors disabled:opacity-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Leads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onEnrich={handleEnrich} 
                  onRemove={(id) => setLeads(prev => prev.filter(l => l.id !== id))} 
                />
              ))}
            </div>

            {leads.length === 0 && !isSearching && !isScoutingCity && (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Zap className="mx-auto text-slate-200 mb-4" size={64} strokeWidth={1} />
                <h3 className="text-xl font-bold text-slate-400">GATHER YOUR LEADS</h3>
                <p className="text-slate-400 text-sm mt-2">Pick a category and a city or county to start hunting.</p>
              </div>
            )}
          </main>

          {isCampaignModalOpen && (
            <EmailCampaignModal 
              leads={leads} 
              onClose={() => setIsCampaignModalOpen(false)} 
            />
          )}

          {isSMSModalOpen && (
            <SMSCampaignModal 
              leads={leads} 
              onClose={() => setIsSMSModalOpen(false)} 
            />
          )}

          {/* Persistent Status Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-2xl z-[60]">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${(isSearching || isBulkEnriching || isSearchingAll) ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></div> 
                  {(isSearching || isBulkEnriching || isSearchingAll) ? 'SYSTEM ACTIVE' : 'SYSTEM READY'}
                </span>
                <span className="text-indigo-600 flex items-center gap-1 truncate max-w-[200px] md:max-w-md">
                  <ChevronRight size={14} /> {searchStatus || 'Awaiting region definition...'}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[10px]">
                <div className={`flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-200 ${quotaColor}`}>
                  <Zap size={10} fill="currentColor" />
                  <span>API QUOTA: {apiRequests}/{MAX_SESSION_REQUESTS}</span>
                </div>
                <span className="bg-slate-100 px-2 py-1 rounded">GEMINI 3 PRO</span>
                <span className="bg-slate-100 px-2 py-1 rounded">SEARCH GROUNDING: ACTIVE</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
