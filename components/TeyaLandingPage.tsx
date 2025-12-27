
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  Minus, 
  Scissors, 
  Sparkles, 
  Dog, 
  Home, 
  Link as LinkIcon,
  HandCoins,
  Layers,
  ChevronDown,
  Wallet,
  Monitor,
  ExternalLink,
  Star,
  X,
  ShieldCheck,
  FileText,
  Cookie,
  Smartphone,
  Tablet,
  Printer,
  WifiOff,
  Percent,
  MonitorSmartphone,
  Cpu,
  User,
  Volume2,
  VolumeX,
  Volume1
} from 'lucide-react';

export const TeyaLandingPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', businessName: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem('posso_cookie_consent');
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      
      // Attempt to play with sound
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay with sound was prevented.
          // Fallback to muted autoplay
          console.log("Autoplay with sound blocked. Falling back to muted.");
          setIsMuted(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const handleAcceptCookies = () => {
    localStorage.setItem('posso_cookie_consent', 'accepted');
    setShowCookieConsent(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else if (newVolume === 0 && !isMuted) {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const whatsappUrl = `https://wa.me/447867597844?text=${encodeURIComponent("Hi Posso team, I'm interested in the Teya card machine and POS systems for my business. Could you provide more information? Thanks!")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const faqs = [
    { q: "How fast is the Teya setup?", a: "Teya setup is incredibly quick. Once you're approved, your terminal is shipped and ready to take payments within 48 hours." },
    { q: "Does Teya work with my POS till?", a: "Yes! Teya Sunmi V2Pro comes with FREE Loyverse point of sale software pre-installed. This allows for automated amount pushing from the POS app directly to the payment module, reducing errors and speeding up your queue." },
    { q: "Does Teya have long contracts?", a: "No. Teya believes in earning your business every month. There are no 3-year lock-ins; just simple, transparent rolling agreements that give you total flexibility." },
    { q: "How do Teya payouts work?", a: "Teya offers Instant Payouts as standard through the Teya Business Account. No more waiting days for your hard-earned money to hit your account—it arrives in seconds." },
    { q: "What kind of support does Teya offer?", a: "Teya provides world-class support including a dedicated UK helpdesk. You can get help instantly via WhatsApp or phone, and as your official partner, Posso.uk provides an extra layer of local UK assistance." }
  ];

  const barberServices = [
    { name: 'Skin Fade', price: '£25.00', color: 'bg-white/20' },
    { name: 'Beard Trim', price: '£15.00', color: 'bg-white/20' },
    { name: 'Hot Shave', price: '£20.00', color: 'bg-white/20' },
    { name: 'Kids Cut', price: '£12.00', color: 'bg-white/20' },
    { name: 'Hair Gel', price: '£8.50', color: 'bg-white/10' },
    { name: 'Shampoo', price: '£6.00', color: 'bg-white/10' },
  ];

  return (
    <div className="bg-teya-light min-h-screen text-teya-dark selection:bg-teya-lime selection:text-teya-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-[100]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-teya-dark rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-teya-lime">
                  <path d="M20 20 L80 20 L80 40 L50 40 L50 80 L20 80 Z" />
                </svg>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-2xl tracking-tighter leading-none">teya</span>
                <span className="text-[10px] font-black text-teya-grey uppercase tracking-widest">by posso.uk</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.posso.uk" target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center gap-2 text-sm font-bold text-teya-grey hover:text-teya-dark transition-colors">
              <Monitor size={16} /> EPOS Systems
            </a>
            <button className="hidden sm:block text-sm font-bold hover:underline">Log in ↗</button>
            <button 
              onClick={() => document.getElementById('capture-form')?.scrollIntoView({ behavior: 'smooth' })} 
              className="bg-teya-lime text-teya-dark px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:brightness-105 transition-all"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <Star size={12} className="text-teya-lime fill-teya-lime" /> Official Posso.uk Reseller
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-teya-dark leading-[0.95] tracking-tighter mb-4">
              Payments to power<br />your business
            </h1>
            <p className="text-xl text-teya-grey font-medium mb-12">
              The Teya Sunmi V2Pro: A high-performance card machine with built-in <span className="text-teya-dark font-black underline decoration-teya-lime">FREE</span> Loyverse POS software.
            </p>

            <div className="space-y-8 mb-12">
              {[
                { icon: Zap, title: 'Instant Payouts', desc: 'Get your money immediately with our instant settlement feature.' },
                { icon: Monitor, title: 'All-in-One Sunmi V2Pro', desc: 'Includes FREE Loyverse point of sale till software. No tablets needed.' },
                { icon: HandCoins, title: 'Blended Rates', desc: '1.65% flat rate – no hidden charges, no surprises.', highlight: true },
                { icon: Wallet, title: 'FREE Business Account', desc: 'Manage your funds with a complimentary business account included.' },
                { icon: LinkIcon, title: 'Pay by Link', desc: 'For payments from anyone, anywhere – send a quick link.' }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${item.highlight ? 'bg-white shadow-xl shadow-slate-100 ring-1 ring-slate-100 teya-card-highlight' : 'opacity-80'}`}
                >
                  <div className="mt-1">
                    <item.icon size={22} className="text-teya-lime" fill={item.highlight ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-teya-dark">{item.title}</h4>
                    <p className="text-sm text-teya-grey font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('capture-form')?.scrollIntoView({ behavior: 'smooth' })} 
                className="bg-teya-lime text-teya-dark px-10 py-5 rounded-xl text-lg font-black tracking-tight hover:brightness-105 transition-all shadow-lg shadow-teya-lime/20"
              >
                Get started today
              </button>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-3 px-10 py-5 rounded-xl border-2 border-slate-100 font-bold hover:bg-slate-50 transition-all"
              >
                <MessageSquare className="text-emerald-500" /> WhatsApp help
              </a>
            </div>
          </div>

          <div className="relative lg:pl-12 flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] teya-bg-lime opacity-5 blur-[120px] rounded-full"></div>
            <div className="relative z-10 w-full max-w-lg">
              <div className="bg-teya-dark rounded-[3.5rem] p-4 shadow-2xl border-4 border-slate-800 overflow-hidden">
                <div className="bg-teya-lime rounded-t-[2.5rem] h-16 flex items-center justify-center">
                  <div className="w-12 h-1 bg-teya-dark/20 rounded-full"></div>
                </div>
                <div className="bg-black rounded-b-[2.5rem] h-[750px] overflow-hidden flex flex-col items-center justify-center relative group">
                   <video 
                     ref={videoRef}
                     src="https://www.takeaways-near-me.co.uk/wp-content/uploads/2025/12/barbers-and-retail.mp4"
                     autoPlay 
                     loop 
                     muted={isMuted} 
                     playsInline 
                     className="w-full h-full object-cover"
                   />
                   
                   {/* Unmute/Mute Toggle - Floating */}
                   <button 
                     onClick={toggleMute}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teya-lime/90 backdrop-blur-md text-teya-dark p-6 rounded-full shadow-2xl scale-110 opacity-0 group-hover:opacity-100 transition-all active:scale-95 z-20"
                   >
                     {isMuted ? <VolumeX size={32} strokeWidth={2.5} /> : <Volume2 size={32} strokeWidth={2.5} />}
                   </button>

                   {/* Modern Volume Control Bar at Bottom */}
                   <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                      <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
                        <button 
                          onClick={toggleMute}
                          className="text-white hover:text-teya-lime transition-colors"
                        >
                          {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
                        </button>
                        <div className="flex-1 flex items-center gap-3">
                           <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.01" 
                              value={isMuted ? 0 : volume} 
                              onChange={handleVolumeChange}
                              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teya-lime"
                              style={{
                                background: `linear-gradient(to right, #e2f33e ${ (isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${ (isMuted ? 0 : volume) * 100}%)`
                              }}
                           />
                           <span className="text-[10px] font-black text-white w-8 text-right">
                              {Math.round((isMuted ? 0 : volume) * 100)}%
                           </span>
                        </div>
                      </div>
                   </div>
                   
                   <div className="absolute bottom-24 left-6 right-6 pointer-events-none group-hover:opacity-0 transition-opacity">
                      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-teya-lime rounded-lg flex items-center justify-center shrink-0">
                          <Zap size={20} className="text-teya-dark" fill="currentColor" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-teya-dark">Integrated Payments</p>
                          <p className="text-[10px] font-bold text-teya-grey">Official FREE Loyverse & Teya Setup</p>
                        </div>
                      </div>
                   </div>

                   <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-none">
                      <div className="bg-teya-lime text-teya-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                        <div className="w-1.5 h-1.5 bg-teya-dark rounded-full animate-pulse"></div>
                        Live Preview
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Point of Sale Section - Loyverse Integration */}
      <section className="py-32 px-4 bg-teya-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side visual mockup - Updated to Barber Shop Sunmi V2Pro handheld */}
            <div className="relative">
              <div className="absolute -inset-4 bg-teya-lime/20 rounded-[3rem] blur-3xl opacity-50"></div>
              <div className="relative flex flex-col items-center justify-center">
                {/* Sunmi V2Pro Handheld Mockup */}
                <div className="w-[300px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 relative">
                   {/* Printer Head Section */}
                   <div className="bg-slate-800 rounded-t-[2.5rem] h-20 -mx-3 -mt-3 flex flex-col items-center justify-center border-b border-slate-700">
                      <div className="w-20 h-1 bg-slate-700 rounded-full mb-2"></div>
                      <div className="w-32 h-0.5 bg-slate-900/50"></div>
                   </div>
                   
                   {/* Main Screen showing Loyverse Barber POS */}
                   <div className="bg-[#2e7d32] rounded-b-[2rem] h-[520px] relative overflow-hidden flex flex-col mt-4">
                      <div className="p-4 bg-white/10 flex justify-between items-center text-white border-b border-white/10">
                         <div className="text-[10px] font-black">Barber Shop POS</div>
                         <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-teya-lime rounded-full"></div>
                            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                         </div>
                      </div>
                      <div className="flex-1 p-4 grid grid-cols-2 gap-4">
                         {barberServices.map((service, i) => (
                           <div key={i} className={`${service.color} rounded-[1.25rem] flex flex-col p-4 gap-2 border border-white/10 shadow-sm hover:scale-[1.05] transition-all cursor-pointer group active:scale-95`}>
                             <div className="w-full aspect-square bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                {i < 4 ? <Scissors size={28} className="text-white opacity-60" /> : <Sparkles size={28} className="text-white opacity-60" />}
                             </div>
                             <div className="mt-1">
                                <p className="text-[11px] font-black text-white truncate leading-tight uppercase tracking-wide">{service.name}</p>
                                <p className="text-[10px] font-bold text-teya-lime">{service.price}</p>
                             </div>
                           </div>
                         ))}
                      </div>
                      <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                         <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center">
                                  <User size={12} className="text-slate-400" />
                               </div>
                               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ticket Total</span>
                            </div>
                            <span className="text-lg font-black text-slate-900">£40.00</span>
                         </div>
                         <div className="flex gap-2">
                            <div className="flex-1 h-12 bg-[#2e7d32] rounded-2xl flex items-center justify-center text-white text-[12px] font-black uppercase tracking-[0.1em] shadow-lg shadow-green-100 ring-2 ring-green-100/50">
                               Charge
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Base of terminal */}
                   <div className="h-14 bg-slate-900 -mx-3 -mb-3 rounded-b-[3rem] flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                        <div className="w-5 h-5 rounded-full bg-slate-600"></div>
                      </div>
                   </div>
                </div>

                {/* Hardware Callout */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-3 bg-teya-dark text-white px-8 py-5 rounded-3xl shadow-2xl shadow-slate-200 border-2 border-slate-800">
                    <div className="w-12 h-12 bg-teya-lime rounded-2xl flex items-center justify-center shrink-0">
                      <Scissors className="text-teya-dark" size={28} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-black uppercase tracking-widest text-teya-lime leading-tight">Barber Shop Ready</p>
                      <p className="text-sm font-bold text-slate-400">All-in-one handheld POS for your station.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-teya-lime text-teya-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                Built-in FREE Loyverse POS
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-8">
                Point of sale
              </h2>
              <p className="text-xl font-medium text-teya-grey mb-12 leading-relaxed">
                The Teya Sunmi V2Pro terminal isn't just a card machine. It's an easy-to-use handheld system with <span className="text-teya-dark font-black">FREE point of sale till software</span> that replaces your bulky till.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Printer, text: 'Issue printed or electronic receipts' },
                  { icon: Percent, text: 'Apply discounts and issue refunds' },
                  { icon: WifiOff, text: 'Keep recording sales even when offline' },
                  { icon: MonitorSmartphone, text: 'Connect a receipt printer, barcode scanner, and cash drawer' },
                  { icon: Monitor, text: 'Connect Loyverse Customer Display app' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-teya-dark group-hover:bg-teya-lime transition-all">
                      <item.icon size={20} />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm relative">
                <div className="absolute top-0 right-10 -translate-y-1/2">
                   <div className="bg-teya-dark text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                      The Verdict
                   </div>
                </div>
                <p className="text-lg font-bold text-teya-dark leading-relaxed italic">
                  "Most providers force you to buy expensive till screens and tablets. With Posso & Teya, the Sunmi V2Pro handles everything with <span className="font-black underline decoration-teya-lime">FREE point of sale software</span>. No other hardware is needed - just the Teya card machine."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EPOS Cross-sell Section */}
      <section className="py-24 px-4 bg-teya-dark text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Need a complete till system?</h2>
            <p className="text-xl text-slate-400 font-medium mb-8 leading-relaxed">
              Posso.uk provides world-class EPOS solutions that link directly to your Teya card machine. Reduce mistakes, manage inventory, and grow your business with a professional setup.
            </p>
            <div className="flex flex-wrap gap-4">
               <a href="https://www.posso.uk" target="_blank" rel="noopener noreferrer" className="bg-teya-lime text-teya-dark px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:brightness-105 transition-all">
                  Visit Posso.uk <ExternalLink size={14} />
               </a>
               <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white/20 transition-all border border-white/20">
                  Ask about Bundles
               </a>
            </div>
          </div>
          <div className="lg:w-5/12 grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <Monitor className="text-teya-lime mb-4" />
                <h4 className="font-bold mb-1">Hardware</h4>
                <p className="text-xs text-slate-400">Professional touchscreens & printers.</p>
             </div>
             <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <Layers className="text-teya-lime mb-4" />
                <h4 className="font-bold mb-1">FREE Loyverse</h4>
                <p className="text-xs text-slate-400">Software setup & training.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="pricing" className="py-32 px-4 bg-teya-light">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-black tracking-tight mb-6">Blended & Transparent</h2>
          <p className="text-xl text-teya-grey font-medium">Posso.uk provides simple rates with zero hidden extras.</p>
        </div>
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                <th className="px-10 py-8 text-sm font-black text-teya-grey uppercase tracking-widest">Everything included</th>
                <th className="px-10 py-8 text-sm font-black text-teya-dark uppercase tracking-widest bg-teya-lime/10">Posso.uk (Teya)</th>
                <th className="px-10 py-8 text-sm font-black text-teya-grey uppercase tracking-widest">Standard Banks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { label: 'Blended Transaction Fee', teya: '1.65%', other: '1.75% - 2.5%+' },
                { label: 'Hidden Charges', teya: 'Zero', other: 'PCI, Admin, Auth Fees' },
                { label: 'Payout Speed', teya: 'INSTANT', other: '2-4 Business Days' },
                { label: 'Business Account', teya: 'FREE', other: 'Monthly Fees' },
                { label: 'Loyverse Till Software', teya: 'FREE', other: 'Usually Extra' },
                { label: 'UK Support', teya: 'WhatsApp + Phone', other: 'Automated Bots' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-7 font-bold text-teya-dark">{row.label}</td>
                  <td className="px-10 py-7 font-black text-teya-dark bg-teya-lime/5">{row.teya}</td>
                  <td className="px-10 py-7 font-medium text-teya-grey">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="products" className="py-32 px-4 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Built for local heroes</h2>
              <p className="text-xl text-teya-grey font-medium">Industry-specific features for UK high streets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Barbers', icon: Scissors, desc: 'Accept payments right at the chair. Quick checkout for high-turnover days.' },
              { title: 'Nail Bars', icon: Sparkles, desc: 'Clean, modern design to match your salon aesthetic. Tips made easy.' },
              { title: 'Pet Groomers', icon: Dog, desc: 'Rugged hardware for grooming shops. Perfect for mobile visits too.' },
              { title: 'Home Services', icon: Home, desc: 'Take professional card payments on the job. No more bank transfer delays.' }
            ].map((item, idx) => (
              <div key={idx} className="group bg-teya-light p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                <div className="w-16 h-16 bg-white text-teya-dark rounded-2xl flex items-center justify-center mb-8 group-hover:bg-teya-lime transition-colors shadow-sm">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-teya-grey font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form Section */}
      <section id="capture-form" className="py-32 px-4 bg-teya-light">
        <div className="max-w-5xl mx-auto bg-teya-dark rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
          <div className="lg:w-1/2 p-16 lg:p-24 text-white">
            <div className="inline-flex items-center gap-2 bg-teya-lime/20 text-teya-lime px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-8">
              <Zap size={14} fill="currentColor" /> Limited promo
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-[0.95] tracking-tight">Ready to<br />upgrade?</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              Get your machine with <span className="text-white">£0 upfront costs</span> this week only. Provided by Posso.uk – official till and card machine specialists.
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-teya-lime" />
                  <span className="font-bold text-sm text-white">Instant Payouts Standard</span>
               </div>
               <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-teya-lime" />
                  <span className="font-bold text-sm text-white">FREE Loyverse Till Software Included</span>
               </div>
               <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-teya-lime" />
                  <span className="font-bold text-sm text-white">FREE Business Account Included</span>
               </div>
            </div>
          </div>
          <div className="lg:w-1/2 p-16 lg:p-24 bg-white">
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="w-24 h-24 bg-teya-lime text-teya-dark rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-black mb-4">Request sent!</h3>
                <p className="text-teya-grey font-medium">A Posso.uk specialist will call you within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-teya-light border-none rounded-2xl focus:ring-2 focus:ring-teya-lime outline-none font-bold text-teya-dark placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="e.g. 07700 900000"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-6 py-4 bg-teya-light border-none rounded-2xl focus:ring-2 focus:ring-teya-lime outline-none font-bold text-teya-dark placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Business Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Your shop or trade name"
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                    className="w-full px-6 py-4 bg-teya-light border-none rounded-2xl focus:ring-2 focus:ring-teya-lime outline-none font-bold text-teya-dark placeholder:text-slate-300"
                  />
                </div>
                <button type="submit" className="w-full bg-teya-dark text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-125 transition-all shadow-xl shadow-slate-200">
                  Request callback
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  Official Posso.uk Partnership • Trusted by 50k+ Merchants
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="help" className="py-32 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Any questions?</h2>
            <p className="text-teya-grey font-medium">Everything you need to know about switching via Posso.uk.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-teya-light rounded-3xl overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-8 text-left flex justify-between items-center group"
                >
                  <span className="font-bold text-teya-dark text-lg group-hover:translate-x-1 transition-transform">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-teya-grey font-medium leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-4 bg-teya-dark text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
            <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-teya-lime rounded-xl flex items-center justify-center">
                 <svg viewBox="0 0 100 100" className="w-6 h-6 fill-teya-dark">
                    <path d="M20 20 L80 20 L80 40 L50 40 L50 80 L20 80 Z" />
                 </svg>
               </div>
               <div className="flex flex-col -space-y-1">
                 <span className="font-black text-3xl tracking-tighter leading-none">teya</span>
                 <span className="text-[10px] font-black text-teya-lime uppercase tracking-widest">official reseller: posso.uk</span>
               </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <button onClick={() => document.getElementById('capture-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-teya-lime text-teya-dark px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-105 transition-all">
                Request callback
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white/10 text-teya-lime rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-teya-lime uppercase tracking-widest">Direct Line</p>
                  <p className="text-base font-bold text-white">+44 7867 597844</p>
                </div>
              </a>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Posso.uk – Official Teya Reseller. © 2024. All Rights Reserved.</p>
              <p className="text-[10px] text-slate-600 font-medium mt-2">Specialists in Loyverse POS, EPOS Now, and integrated card machines.</p>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
               <a href="https://www.posso.uk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Posso EPOS <ExternalLink size={10} /></a>
               <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
               <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">General Terms</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      {showCookieConsent && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-96 bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-[200] animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-teya-lime/20 text-teya-dark rounded-xl">
              <Cookie size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider mb-1">Cookie Consent</h4>
              <p className="text-xs text-teya-grey font-medium leading-relaxed">
                We use cookies to enhance your experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAcceptCookies}
              className="flex-1 bg-teya-dark text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-125 transition-all"
            >
              Accept All
            </button>
            <button 
              onClick={() => setShowCookieConsent(false)}
              className="px-4 py-3 text-xs font-black text-teya-grey uppercase tracking-widest hover:text-teya-dark"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Policy Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teya-lime text-teya-dark rounded-2xl shadow-sm">
                  {activeModal === 'privacy' ? <ShieldCheck size={28} /> : <FileText size={28} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    {activeModal === 'privacy' ? 'Privacy Policy' : 'General Terms & Conditions'}
                  </h2>
                  <p className="text-xs font-bold text-teya-grey uppercase tracking-widest">Last updated: March 2024</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 prose prose-slate max-w-none">
              {activeModal === 'privacy' ? (
                <div className="space-y-8 text-sm leading-relaxed text-teya-grey font-medium">
                  <section>
                    <h3 className="text-lg font-black text-teya-dark mb-3 uppercase tracking-wider">1. Information We Collect</h3>
                    <p>At Posso.uk (Official Teya Reseller), we collect information that you provide directly to us through our callback forms, WhatsApp messages, and service inquiries. This includes your name, business name, phone number, and email address.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-black text-teya-dark mb-3 uppercase tracking-wider">2. How We Use Your Data</h3>
                    <p>We use your information to provide the services you request, specifically to connect you with Teya UK for card processing services and to discuss our EPOS solutions. We do not sell your data to third parties.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-black text-teya-dark mb-3 uppercase tracking-wider">3. Data Sharing</h3>
                    <p>As an official Teya reseller, your contact details will be shared with Teya UK (and their affiliated processing partners) to facilitate your application for card processing services. This is essential for the provision of the service.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-black text-teya-dark mb-3 uppercase tracking-wider">4. Your Rights</h3>
                    <p>Under UK GDPR, you have the right to access, rectify, or erase your personal data. You can contact us at any time to request these changes via our official WhatsApp or support channels.</p>
                  </section>
                </div>
              ) : (
                <div className="space-y-8 text-sm leading-relaxed text-teya-grey font-medium">
                  <section>
                    <h3 className="text-lg font-black text-teya-dark mb-3 uppercase tracking-wider">1. Service Overview</h3>
                    <p>Posso.uk acts as an authorized marketing agent and reseller for Teya UK. We provide consulting, lead generation, and EPOS hardware solutions (e.g., Loyverse setups) that integrate with Teya card machines.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-black text-teya-dark mb-3 uppercase tracking-wider">2. Pricing & Fees</h3>
                    <p>The "Blended 1.65%" rate is subject to business approval and specific merchant category codes. Final rates are determined by Teya's underwriting team during the application process. Posso.uk does not set the final processing fees.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-black text-teya-dark mb-3 uppercase tracking-wider">3. Hardware & Software</h3>
                    <p>Any EPOS hardware purchased from Posso.uk is subject to separate warranty and return policies. Software integrations (like Loyverse) are provided as-is, and Posso.uk provides training as a courtesy or paid service as agreed.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-black text-teya-dark mb-3 uppercase tracking-wider">4. Payouts</h3>
                    <p>Instant payouts are a feature of the Teya platform. Eligibility for instant settlement depends on Teya's internal risk assessment and bank account compatibility. Not all accounts may support instant transfers.</p>
                  </section>
                </div>
              )}
            </div>
            <div className="p-10 border-t border-slate-50 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="bg-teya-dark text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-125 transition-all shadow-lg"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
