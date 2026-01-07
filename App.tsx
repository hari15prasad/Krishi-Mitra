
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, MessageCircle, Camera, FileText, IndianRupee, Settings, Mic, MicOff, 
  ChevronRight, Search, LogOut, Send, Loader2, AlertTriangle, Globe, 
  CheckCircle2, XCircle, MapPin, User, Sprout, Info, Droplets, Sun, Wind, Edit2, CloudRain, ExternalLink, RefreshCw
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Language, UserProfile, Scheme, CropPrice } from './types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, MOCK_SCHEMES, MOCK_PRICES } from './constants';
import { chatWithGemini, analyzeCropImage, getLiveWeather, translateScheme, getMandiPrices, analyzeSoilReport } from './services/gemini';

// --- Audio Encoding/Decoding Helpers ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): any {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Flag Mapping ---
const LANGUAGE_FLAGS: Record<string, string> = {
  'en': '🇬🇧', 'hi': '🇮🇳', 'kn': '🇮🇳', 'te': '🇮🇳', 'ta': '🇮🇳',
  'bn': '🇮🇳', 'mr': '🇮🇳', 'gu': '🇮🇳', 'ml': '🇮🇳', 'pa': '🇮🇳'
};

// --- UI Components ---

const Button = ({ onClick, children, className = '', variant = 'primary', disabled = false, type = 'button' }: any) => {
  const base = "px-6 py-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer w-full";
  const variants = {
    primary: "bg-green-600 text-white shadow-lg shadow-green-100",
    secondary: "bg-white border border-slate-200 text-slate-700",
    outline: "border-2 border-green-600 text-green-600 bg-white",
    danger: "bg-red-50 text-red-600 border border-red-100"
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, error, type = "text", disabled = false }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 block">{label}</label>
    <div className="relative">
      <input 
        type={type}
        disabled={disabled}
        className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-400 focus:ring-red-50' : 'border-slate-100 focus:ring-green-100'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-[10px] mt-1 font-medium">{error}</p>}
    </div>
  </div>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [langSelected, setLangSelected] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [otpPopup, setOtpPopup] = useState<string | null>(null);

  const [regForm, setRegForm] = useState({
    name: '', state: '', district: '', landSize: '', crops: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('km_user');
    const savedLang = localStorage.getItem('km_lang');
    if (saved) {
      setUser(JSON.parse(saved));
      setLangSelected(true);
    }
    if (savedLang) setLang(savedLang as Language);
  }, []);

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.['en'] || key;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!otpSent) {
      if (!/^\d{10}$/.test(phone)) { 
        setErrors({ phone: t('phoneNumber') + ' ' + t('requiredField') });
        return;
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      setOtpPopup(code);
      return;
    }
    
    if (otp !== generatedOtp) {
      setErrors({ otp: 'Invalid OTP' });
      return;
    }

    const existing = localStorage.getItem('km_user');
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.phone === phone) {
        setUser(parsed);
        setOtpPopup(null);
        return;
      }
    }
    setIsRegistering(true);
    setOtpPopup(null);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!regForm.name) newErrors.name = t('requiredField');
    if (!regForm.state) newErrors.state = t('requiredField');
    if (!regForm.district) newErrors.district = t('requiredField');
    if (!regForm.landSize) newErrors.landSize = t('requiredField');
    if (!regForm.crops) newErrors.crops = t('requiredField');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const newUser: UserProfile = {
      ...regForm,
      phone,
      crops: regForm.crops.split(',').map(c => c.trim()).filter(c => c)
    };
    setUser(newUser);
    localStorage.setItem('km_user', JSON.stringify(newUser));
  };

  const logout = () => {
    localStorage.removeItem('km_user');
    setUser(null);
    setOtpSent(false);
    setPhone('');
    setIsRegistering(false);
    setActiveTab('home');
    setLangSelected(false);
  };

  if (!langSelected) {
    return (
      <div className="min-h-screen bg-green-600 flex flex-col p-6 text-white overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center pt-10">
          <div className="w-24 h-24 mb-6">
            <img src="https://img.icons8.com/color/144/wheat.png" alt="logo" className="w-full" />
          </div>
          <h1 className="text-3xl font-black text-center mb-2">Krishi Mitra</h1>
          <p className="text-green-100 opacity-80 mb-12 text-center">Smart Agriculture Assistant</p>
          <p className="text-sm font-bold mb-6">{t('selectLanguage')}</p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button 
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`p-5 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all relative ${lang === l.code ? 'bg-white text-slate-800 border-white' : 'bg-white/10 border-white/10 text-white'}`}
              >
                <span className="text-2xl">{LANGUAGE_FLAGS[l.code]}</span>
                <span className="font-bold text-sm">{l.nativeName}</span>
                {lang === l.code && <div className="absolute top-2 right-2"><CheckCircle2 size={16} className="text-green-500" /></div>}
              </button>
            ))}
          </div>
          <Button onClick={() => {setLangSelected(true); localStorage.setItem('km_lang', lang);}} className="bg-green-700 border-none shadow-2xl">
            {t('getStarted')}
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    if (isRegistering) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col p-6 justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-xl">
             <h2 className="text-2xl font-black mb-6">{t('personalInfo')}</h2>
             <form onSubmit={handleRegister} className="space-y-4">
               <InputField label={t('fullName')} value={regForm.name} onChange={(v:any) => setRegForm({...regForm, name: v})} placeholder="Real Name" error={errors.name} />
               <InputField label={t('state')} value={regForm.state} onChange={(v:any) => setRegForm({...regForm, state: v})} placeholder="State Name" error={errors.state} />
               <InputField label={t('district')} value={regForm.district} onChange={(v:any) => setRegForm({...regForm, district: v})} placeholder="District Name" error={errors.district} />
               <InputField label={t('landAcres')} type="number" value={regForm.landSize} onChange={(v:any) => setRegForm({...regForm, landSize: v})} placeholder="Size in Acres" error={errors.landSize} />
               <InputField label={t('crops')} value={regForm.crops} onChange={(v:any) => setRegForm({...regForm, crops: v})} placeholder="Crops grown" error={errors.crops} />
               <Button type="submit">{t('getStarted')}</Button>
             </form>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col p-6 justify-center items-center relative">
        {otpPopup && (
          <div className="absolute top-10 left-6 right-6 z-[100] bg-green-600 text-white p-6 rounded-3xl shadow-2xl border-2 border-white animate-bounce">
            <p className="text-xs font-bold uppercase mb-1">{t('otpNotice')}</p>
            <p className="text-4xl font-black tracking-widest">{otpPopup}</p>
          </div>
        )}
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-xl">
          <h2 className="text-2xl font-black mb-6 text-center">{t('login')}</h2>
          <form onSubmit={handleAuth} className="space-y-4">
            <InputField label={t('phoneNumber')} value={phone} onChange={(v:any) => setPhone(v.replace(/\D/g, ''))} placeholder="10-digit mobile" disabled={otpSent} error={errors.phone} />
            {otpSent && <InputField label={t('enterOtp')} value={otp} onChange={(v:any) => setOtp(v.replace(/\D/g, ''))} placeholder="6-digit OTP" error={errors.otp} />}
            <Button type="submit">{otpSent ? t('verify') : t('sendOtp')}</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative">
      {isVoiceActive && <VoiceOverlay user={user} lang={lang} onClose={() => setIsVoiceActive(false)} t={t} />}
      <main className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'home' && <HomeView user={user} setTab={setActiveTab} setIsVoiceActive={setIsVoiceActive} lang={lang} t={t} />}
        {activeTab === 'chat' && <ChatView user={user} lang={lang} t={t} />}
        {activeTab === 'mandi' && <MandiView user={user} lang={lang} t={t} />}
        {activeTab === 'disease' && <DiseaseView lang={lang} t={t} />}
        {activeTab === 'soil' && <SoilView user={user} lang={lang} t={t} />}
        {activeTab === 'schemes' && <SchemesView user={user} lang={lang} t={t} />}
        {activeTab === 'profile' && <ProfileView user={user} lang={lang} onLogout={logout} t={t} />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-4 py-3 flex justify-between items-center z-50">
        <NavBtn icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label={t('home')} />
        <NavBtn icon={Mic} active={isVoiceActive} onClick={() => setIsVoiceActive(true)} label={t('voice')} />
        <NavBtn icon={IndianRupee} active={activeTab === 'mandi'} onClick={() => setActiveTab('mandi')} label={t('marketPrices_title')} />
        <NavBtn icon={MessageCircle} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label={t('chat')} />
        <NavBtn icon={Globe} active={activeTab === 'schemes'} onClick={() => setActiveTab('schemes')} label={t('schemes')} />
        <NavBtn icon={User} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label={t('profile')} />
      </nav>
    </div>
  );
}

const NavBtn = ({ icon: Icon, active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-green-600' : 'text-slate-400'}`}>
    <div className={`p-2 rounded-xl ${active ? 'bg-green-100' : ''}`}><Icon size={20} /></div>
    <span className="text-[9px] font-bold">{label}</span>
  </button>
);

const HomeView = ({ user, setTab, setIsVoiceActive, lang, t }: any) => {
  const [weather, setWeather] = useState<string | null>(null);
  const [wLoading, setWLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await getLiveWeather(user, lang);
        setWeather(res);
      } catch (e) {
        setWeather("Unable to load live weather.");
      } finally {
        setWLoading(false);
      }
    }
    fetchWeather();
  }, [user, lang]);

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="bg-green-700 p-8 pb-12 text-white">
        <div className="flex flex-col gap-1 mb-6">
          <span className="text-sm font-medium opacity-80">{t('welcome')}</span>
          <h2 className="text-2xl font-black">{user.name}</h2>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-yellow-400 p-2 rounded-full"><Sun size={24} className="text-white" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-green-100">{t('district')}</p>
              <h3 className="text-xl font-black">{user.district}</h3>
            </div>
          </div>
          <div className="text-sm font-medium leading-relaxed text-green-50">
            {wLoading ? (
              <div className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Fetching live forecast...</div>
            ) : (
              <p className="whitespace-pre-wrap">{weather}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-lg font-black text-slate-800">{t('quickAccess')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColoredCard icon={Mic} title={t('voiceAssistant_title')} sub="Proactive Voice Help" color="bg-violet-600" onClick={() => setIsVoiceActive(true)} />
          <ColoredCard icon={Camera} title={t('diseaseDetection_title')} sub="AI Crop Scan" color="bg-red-600" onClick={() => setTab('disease')} />
          <ColoredCard icon={IndianRupee} title={t('marketPrices_title')} sub="Live Mandi Rates" color="bg-blue-600" onClick={() => setTab('mandi')} />
          <ColoredCard icon={FileText} title={t('soilHealth_title')} sub="AI Soil Report" color="bg-orange-500" onClick={() => setTab('soil')} />
        </div>
      </div>
    </div>
  );
};

const MandiView = ({ user, lang, t }: any) => {
  const [data, setData] = useState<{ text: string, sources: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMandiPrices(user, lang);
      setData(res);
    } catch (e) {
      setData({ text: "Error loading prices.", sources: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, lang]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">{t('marketPrices_title')}</h2>
        <button onClick={fetchData} className="p-2 bg-green-100 text-green-600 rounded-full active:rotate-180 transition-all">
          <RefreshCw size={20} />
        </button>
      </div>
      
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-green-600" size={32} />
          <p className="font-bold text-slate-400">Fetching live market rates for {user.crops.join(', ')}...</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <Card className="bg-white border-green-50 shadow-lg">
             <div className="flex items-center gap-2 mb-4 text-green-600">
                <MapPin size={18} />
                <span className="font-bold uppercase tracking-widest text-[10px]">{user.district} Markets</span>
             </div>
             <div className="prose prose-slate prose-sm max-w-none text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                {data?.text}
             </div>
          </Card>

          {data?.sources && data.sources.length > 0 && (
            <div className="space-y-3">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Data Sources</h4>
               <div className="flex flex-col gap-2">
                 {data.sources.map((url, i) => (
                   <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-green-200 transition-colors group">
                      <span className="text-[10px] font-bold text-slate-600 truncate max-w-[200px]">{url}</span>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-green-600" />
                   </a>
                 ))}
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SoilView = ({ user, lang, t }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        analyze(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async (base64: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeSoilReport(base64, lang, user);
      setResult(res || "Analysis failed.");
    } catch (err) {
      setResult("Error analyzing soil report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><FileText size={24} /></div>
        <h2 className="text-2xl font-black">{t('soilHealth_title')}</h2>
      </div>
      
      {!image && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square bg-white rounded-[2.5rem] border-4 border-dashed border-orange-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-orange-50/30 transition-colors"
        >
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-400">
             <Camera size={40} />
          </div>
          <div className="text-center px-6">
            <p className="font-black text-slate-700">Upload Soil Report</p>
            <p className="text-xs font-bold text-slate-400 mt-1">Take a clear photo of your Soil Health Card</p>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      )}

      {image && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
            <img src={image} alt="Soil Report" className="w-full aspect-video object-cover" />
            <button onClick={() => {setImage(null); setResult(null);}} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"><XCircle size={20} /></button>
          </div>
          
          {loading ? (
            <Card className="flex flex-col items-center gap-4 py-12 border-orange-100">
              <div className="relative">
                <Loader2 className="animate-spin text-orange-600" size={48} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sprout size={20} className="text-orange-400" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-black text-slate-700">Expert Soil Analysis in Progress...</p>
                <p className="text-xs font-bold text-slate-400 animate-pulse">Checking Nitrogen, Phosphorus & pH levels</p>
              </div>
            </Card>
          ) : (
            result && (
              <Card className="bg-white border-orange-50 shadow-xl overflow-hidden p-0">
                <div className="bg-orange-600 px-6 py-3 text-white">
                   <h4 className="text-xs font-black uppercase tracking-widest">Soil Health Diagnostics</h4>
                </div>
                <div className="p-6 prose prose-slate prose-sm max-w-none font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              </Card>
            )
          )}
          
          {!loading && <Button variant="secondary" onClick={() => {setImage(null); setResult(null);}}>Scan Another Report</Button>}
        </div>
      )}
    </div>
  );
};

const ColoredCard = ({ icon: Icon, title, sub, color, onClick }: any) => (
  <button onClick={onClick} className={`${color} p-6 rounded-[2.5rem] text-white flex flex-col items-center text-center gap-3 shadow-xl transition-all active:scale-95`}>
    <Icon size={32} strokeWidth={2.5} />
    <div><h4 className="font-bold text-sm leading-tight">{title}</h4><p className="text-[9px] opacity-70 mt-1 uppercase tracking-wider">{sub}</p></div>
  </button>
);

const VoiceOverlay = ({ user, lang, onClose, t }: any) => {
  const [status, setStatus] = useState('Initializing...');
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(false);
  const [lastModelTranscription, setLastModelTranscription] = useState('');
  
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const langMap: Record<string, string> = {
    'kn': 'Kannada', 'ml': 'Malayalam', 'hi': 'Hindi', 'en': 'English', 
    'te': 'Telugu', 'ta': 'Tamil', 'bn': 'Bengali', 'mr': 'Marathi', 
    'gu': 'Gujarati', 'pa': 'Punjabi'
  };

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let isMounted = true;

    async function startLiveSession() {
      try {
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = outputCtx.createGain();
        outputNode.gain.value = 3.5; 
        outputNode.connect(outputCtx.destination);
        
        inputAudioCtxRef.current = inputCtx;
        outputAudioCtxRef.current = outputCtx;
        outputNodeRef.current = outputNode;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            outputAudioTranscription: {},
            inputAudioTranscription: {},
            systemInstruction: `You are Krishi Mitra. Respond EXCLUSIVELY in ${langMap[lang] || 'Hindi'}. 
            Be proactive. Use Google Search grounding to give live weather or mandi prices.
            KNOW YOUR USER (DO NOT ASK AGAIN):
            - Location: ${user.district}, ${user.state}
            - Crops: ${user.crops.join(', ')}
            End with a proactive follow-up question.`,
            tools: [{ googleSearch: {} }]
          },
          callbacks: {
            onopen: () => {
              if (!isMounted) return;
              setStatus('Ready');
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                if (isSpeakingRef.current) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: any) => {
              if (!isMounted) return;
              const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioBase64) {
                setIsSpeaking(true);
                isSpeakingRef.current = true;
                const ctx = outputAudioCtxRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(outputNodeRef.current!);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) {
                    setIsSpeaking(false);
                    isSpeakingRef.current = false;
                  }
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              }
              if (message.serverContent?.interrupted) {
                for (const src of sourcesRef.current) src.stop();
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
                isSpeakingRef.current = false;
              }
              if (message.serverContent?.outputTranscription) {
                setLastModelTranscription(prev => prev + message.serverContent.outputTranscription.text);
              }
              if (message.serverContent?.inputTranscription) {
                setTranscript(message.serverContent.inputTranscription.text);
              }
              if (message.serverContent?.turnComplete) {
                setLastModelTranscription('');
              }
            },
            onclose: () => { if (isMounted) setStatus('Closed'); },
            onerror: () => { if (isMounted) setStatus('Error'); }
          }
        });
        sessionRef.current = await sessionPromise;
      } catch (err) { if (isMounted) setStatus('Mic Error'); }
    }

    startLiveSession();
    return () => {
      isMounted = false;
      if (sessionRef.current) sessionRef.current.close();
      if (inputAudioCtxRef.current) inputAudioCtxRef.current.close();
      if (outputAudioCtxRef.current) outputAudioCtxRef.current.close();
    };
  }, [lang]);

  return (
    <div className="fixed inset-0 z-[100] bg-violet-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-white">
      <div className="relative mb-12">
        <div className={`w-32 h-32 bg-white/10 rounded-full flex items-center justify-center animate-pulse transition-all ${isSpeaking ? 'scale-125 bg-white/20' : 'bg-white/10'}`}>
          <Mic size={48} className={isSpeaking ? 'text-violet-200' : 'text-white'} />
        </div>
      </div>
      <h2 className="text-2xl font-black mb-2 text-center">{status === 'Ready' ? t('welcome') : status}</h2>
      <p className="text-violet-200 text-center text-sm mb-10 h-16 italic overflow-hidden max-w-xs">{transcript || '...'}</p>
      <div className="bg-white/5 p-6 rounded-3xl w-full max-h-[30vh] overflow-y-auto text-sm leading-relaxed border border-white/10">
        {lastModelTranscription || '...'}
      </div>
      <button onClick={onClose} className="mt-auto px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black border border-white/10">
        {t('closeAssistant')}
      </button>
    </div>
  );
};

const DiseaseView = ({ lang, t }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        analyze(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async (base64: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeCropImage(base64, lang);
      setResult(res || "Analysis failed.");
    } catch (err) {
      setResult("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-black">{t('diseaseDetection_title')}</h2>
      
      {!image && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square bg-slate-100 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 cursor-pointer"
        >
          <Camera size={64} className="text-slate-300" />
          <p className="font-bold text-slate-400">Click to upload crop photo</p>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      )}

      {image && (
        <div className="space-y-6">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
            <img src={image} alt="Crop" className="w-full aspect-video object-cover" />
            <button onClick={() => {setImage(null); setResult(null);}} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"><XCircle size={20} /></button>
          </div>
          {loading && <div className="flex flex-col items-center gap-4 py-10"><Loader2 className="animate-spin text-green-600" size={48} /><p className="font-bold text-slate-500 animate-pulse">Analyzing health status...</p></div>}
          {result && <Card className="bg-white border-green-100 prose prose-slate max-w-none font-medium text-slate-700 text-sm">{result}</Card>}
        </div>
      )}
    </div>
  );
};

const SchemesView = ({ user, lang, t }: any) => {
  const [translatedSchemes, setTranslatedSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const filtered = MOCK_SCHEMES.filter(s => s.state === 'Central' || s.state.toLowerCase() === user.state.toLowerCase());
      const results = await Promise.all(filtered.map(async (s) => {
        const trans = await translateScheme(s, lang);
        return { ...s, ...trans };
      }));
      setTranslatedSchemes(results);
      setLoading(false);
    }
    load();
  }, [user, lang]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-black mb-6">{t('schemes')}</h2>
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4"><Loader2 className="animate-spin text-green-600" /><p className="font-bold text-slate-400">Translating schemes for you...</p></div>
      ) : (
        translatedSchemes.map(s => (
          <Card key={s.id} className="space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <h4 className="font-black text-slate-800 text-lg leading-tight flex-1 pr-4">{s.name}</h4>
              <span className="bg-green-50 text-green-600 text-[10px] px-2 py-1 rounded-lg font-black uppercase">{s.state}</span>
            </div>
            <p className="text-xs font-bold text-slate-500">{s.benefits}</p>
            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{t('docsRequired')}</h5>
              <ul className="text-xs font-bold text-slate-700 list-disc list-inside">{s.documents.map((doc: any, idx: number) => <li key={idx}>{doc}</li>)}</ul>
            </div>
            <Button className="w-full text-xs py-3 font-black" variant="outline" onClick={() => window.open(s.link, '_blank')}>{t('applyNow')}</Button>
          </Card>
        ))
      )}
    </div>
  );
};

const ProfileView = ({ user, lang, onLogout, t }: any) => (
  <div className="flex flex-col animate-in fade-in duration-500">
    <div className="bg-violet-700 p-8 pb-20 text-white rounded-b-[3rem]"><h2 className="text-2xl font-black mb-2">{t('profile')}</h2></div>
    <div className="px-6 -mt-14 flex flex-col items-center">
      <div className="w-28 h-28 rounded-full bg-violet-600 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-white mb-6">{user.name[0]}</div>
      <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-xl space-y-6">
        <ProfileItem label={t('fullName')} value={user.name} />
        <ProfileItem label={t('phoneNumber')} value={user.phone} />
        <ProfileItem label={t('state')} value={user.state} />
        <ProfileItem label={t('district')} value={user.district} />
        <ProfileItem label={t('landAcres')} value={user.landSize} />
        <div className="pt-6"><Button variant="danger" onClick={onLogout}>{t('logout')}</Button></div>
      </div>
    </div>
  </div>
);

const ProfileItem = ({ label, value }: any) => (
  <div className="space-y-1.5">
    <p className="text-xs font-bold text-slate-400">{label}</p>
    <div className="bg-slate-50 p-4 rounded-2xl text-sm font-bold text-slate-700 border border-slate-100">{value}</div>
  </div>
);

const ChatView = ({ user, lang, t }: any) => {
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput('');
    setMsgs(p => [...p, { role: 'user', text: txt }]);
    setLoading(true);
    try {
      const res = await chatWithGemini(txt, lang, user, history);
      setMsgs(p => [...p, { role: 'bot', text: res.text }]);
      setHistory(p => [...p, { role: 'user', parts: [{ text: txt }] }, res.modelMessage]);
    } catch {
      setMsgs(p => [...p, { role: 'bot', text: "Error fetching live data. Try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] p-6">
      <div className="flex-1 overflow-y-auto space-y-4 pb-6">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm font-bold ${m.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 rounded-tl-none text-slate-700'}`}>{m.text}</div>
          </div>
        ))}
        {loading && <Loader2 className="animate-spin mx-auto text-green-600" />}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 bg-white p-2 rounded-3xl border border-slate-100 shadow-xl">
        <input className="flex-1 px-5 py-3 text-sm focus:outline-none" placeholder="Ask about rain, prices..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
        <button onClick={send} className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white"><Send size={20} /></button>
      </div>
    </div>
  );
};
