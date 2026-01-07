
import { Language, TranslationDict, Scheme, CropPrice } from './types';

export const SUPPORTED_LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'মরাठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const TRANSLATIONS: TranslationDict = {
  home: { en: 'Home', hi: 'मुख्य', bn: 'হোম', te: 'హోమ్', mr: 'मुख्य', ta: 'முகப்பு', gu: 'હોમ', kn: 'ಮುಖಪುಟ', ml: 'ഹോം', pa: 'ਹੋਮ' },
  chat: { en: 'Chat', hi: 'चैट', bn: 'চ্যাট', te: 'చాట్', mr: 'चॅट', ta: 'அரட்டை', gu: 'ચેટ', kn: 'ಚಾಟ್', ml: 'ಚಾಟ್', pa: 'ಚੈಟ್' },
  voice: { en: 'Voice', hi: 'आवाज', bn: 'ভয়েস', te: 'వాయిస్', mr: 'आवाज', ta: 'குರல்', gu: 'અવાજ', kn: 'ಧ್ವನಿ', ml: 'ಶಬ್ದಂ', pa: 'ਆਵਾਜ਼' },
  disease: { en: 'Doctor', hi: 'डॉक्टर', bn: 'ডাক্তार', te: 'డాక్టర్', mr: 'डॉक्टर', ta: 'டாக்டர்', gu: 'ડોક્ટર', kn: 'ರೋಗ ಪತ್ತೆ', ml: 'രോഗം', pa: 'ਡਾਕਟਰ' },
  schemes: { en: 'Schemes', hi: 'योजनाएं', bn: 'স্কিম', te: 'పథకాలు', mr: 'योजना', ta: 'திட்டங்கள்', gu: 'યોજનાઓ', kn: 'ಯೋಜನೆಗಳು', ml: 'പദ്ധതികൾ', pa: 'ਸਕੀਮਾਂ' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', bn: 'প্রোফাইল', te: 'ప్రొఫైల్', mr: 'प्रोफाइल', ta: 'சுயவிவரம்', gu: 'પ્રોફાઇલ', kn: 'ಪ್ರೊಫೈಲ್', ml: 'ಪ್ರೊಫೈಲ್', pa: 'ਪ੍ਰੌਫਾਈਲ' },
  welcome: { en: 'Welcome', hi: 'नमस्ते', bn: 'স্বাগতম', te: 'స్వాగతం', mr: 'नमस्ते', ta: 'வரவேற்பு', gu: 'નમસ્તે', kn: 'ಸ್ವಾಗತ', ml: 'ಸ್ವಾಗതം', pa: 'ಸੁਆಗತ ਹੈ' },
  quickAccess: { en: 'Quick Access', hi: 'त्वरित पहुँच', bn: 'দ্রুত এক্সেস', te: 'త్వరిత ప్రవేశం', mr: 'द्रुत प्रवेश', ta: 'விரைவான அணுகல்', gu: 'ત્વરિત પહોંચ', kn: 'ತ್ವರಿತ ಪ್ರವೇಶ', ml: 'ദ്രുത പ്രവേശനം', pa: 'ਤੁਰੰਤ ਪਹੁੰਚ' },
  soilMoisture: { en: 'Soil Moisture', hi: 'मिट्टी की नमी', bn: 'মাটির আর্দ্রতা', te: 'మట్టి తేమ', mr: 'जमिनीतील ओलावा', ta: 'மண் ஈரம்', gu: 'જમીનનો ભેજ', kn: 'ಮಣ್ಣಿನ ತೇವಾಂಶ', ml: 'മണ്ണിലെ ഈർപ്പം', pa: 'ಮਿੱਟੀ ਦੀ नमी' },
  optimum: { en: 'Optimum', hi: 'इष्टतम', bn: 'উপযুক্ত', te: 'అనుకూల', mr: 'इष्टतम', ta: 'உகந்த', gu: 'અનુકૂળ', kn: 'ಅನುಕೂಲ', ml: 'അനുയോജ്യം', pa: 'ಅನುವಾದ' },
  humidity: { en: 'Humidity', hi: 'आर्द्रता', bn: 'আর্দ্রতা', te: 'తేమ', mr: 'आद्रता', ta: 'ஈரப்பதம்', gu: 'ભેજ', kn: 'ತೇವಾಂಶ', ml: 'ആർദ്രത', pa: 'ਨਮੀ' },
  wind: { en: 'Wind', hi: 'हवा', bn: 'বাতাস', te: 'గాలి', mr: 'वारा', ta: 'காற்று', gu: 'પવન', kn: 'ಗಾಳಿ', ml: 'കാറ്റ്', pa: 'ਹਵਾ' },
  closeAssistant: { en: 'Close Assistant', hi: 'सहायक बंद करें', bn: 'অ্যাসিস্ট্যান্ট বন্ধ করুন', te: 'అసిస్టెంట్ మూసివేయి', mr: 'सहायक बंद करा', ta: 'உதவியாளரை மூடு', gu: 'સહાયક બંધ કરો', kn: 'ಸಹಾಯಕವನ್ನು ಮುಚ್ಚಿ', ml: 'സഹായി അടയ്ക്കുക', pa: 'ਸਹਾਇਕ ਬੰਦ ਕਰੋ' },
  docsRequired: { en: 'Documents Required', hi: 'आवश्यक दस्तावेज', bn: 'প্রয়োজনীয় নথি', te: 'అవసరమైన పత్రాలు', mr: 'आवश्यक कागदपत्रे', ta: 'தேவையான ஆவணங்கள்', gu: 'જરૂરી દસ્તાવેજો', kn: 'ಬೇಕಾದ ದಾಖಲೆಗಳು', ml: 'ആവശ്യമായ രേഖകൾ', pa: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼' },
  applyNow: { en: 'Apply Now', hi: 'अभी आवेदन करें', bn: 'এখনই আবেদন করুন', te: 'ఇప్పుడే దరఖాస్తు చేయండి', mr: 'आता अर्ज करा', ta: 'இப்போதே விண்ணப்பிக்கவும்', gu: 'હમણાં જ અરજી કરો', kn: 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ', ml: 'ഇപ്പോൾ അപേക്ഷിക്കുക', pa: 'ਹੁਣੇ ਅਪਲਾਈ ਕਰੋ' },
  enterAllDetails: { en: 'Please enter all details', hi: 'कृपया सभी विवरण दर्ज करें', bn: 'দয়া করে সমস্ত বিবরণ লিখুন', te: 'దయచేసి అన్ని వివరాలను నమోదు చేయండి', mr: 'कृपया सर्व तपशील प्रविष्ट करा', ta: 'அனைத்து விவரங்களையும் உள்ளிடவும்', gu: 'કૃપા કરીને બધી વિગતો દાખલ કરો', kn: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ', ml: 'ദയവായി എല്ലാ വിവരങ്ങളും നൽകുക', pa: 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਵੇਰਵੇ ਦਰਜ ਕਰੋ' },
  voiceAssistant_title: { en: 'Voice Assistant', hi: 'आवाज सहायक', bn: 'ভয়েস অ্যাসিস্ট্যান্ট', te: 'వాయిస్ అసిస్టెంట్', mr: 'व्हॉइस असिस्टंट', ta: 'குரல் உதவியாளர்', gu: 'વોઇસ આસિસ્ટન્ટ', kn: 'ಧ್ವನಿ ಸಹಾಯಕ', ml: 'ശബ്ദ സഹായി', pa: 'ਵੌਇਸ ਅਸਿਸਟੈਂਟ' },
  diseaseDetection_title: { en: 'Disease Detection', hi: 'रोग का पता लगाना', bn: 'রোগ সনাক্তকরণ', te: 'రోగ గుర్తింపు', mr: 'रोग शोधणे', ta: 'நோய் கண்டறிதல்', gu: 'રોગની શોધ', kn: 'ರೋಗ ಪತ್ತೆ', ml: 'രോഗനിർണ്ണയം', pa: 'ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ' },
  soilHealth_title: { en: 'Soil Health', hi: 'मृदा स्वास्थ्य', bn: 'মাটির স্বাস্থ্য', te: 'మట్టి ఆరోగ్యం', mr: 'जमिनीचे आरोग्य', ta: 'மண் ஆரோக்கியம்', gu: 'જમીનનું સ્વાસ્થ્ય', kn: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ', ml: 'മണ്ണ് ആരോഗ്യം', pa: 'ਮਿੱਟੀ ਦੀ ਸਿਹਤ' },
  marketPrices_title: { en: 'Market Prices', hi: 'मंडी भाव', bn: 'বাজার দর', te: 'మార్కెట్ ధరలు', mr: 'बाजार भाव', ta: 'சந்தை விலைகள்', gu: 'બજાર ભાવ', kn: 'ಮಂಡಿ ಬೆಲೆಗಳು', ml: 'ವಿಪಣಿ വില', pa: 'ਮੰਡੀ ਦੀਆਂ ਕੀਮਤਾਂ' },
  personalInfo: { en: 'Personal Info', hi: 'व्यक्तिगत जानकारी', bn: 'ব্যক্তিগত তথ্য', te: 'వ్యక్తిగత సమాచారం', mr: 'वैयक्तिक माहिती', ta: 'தனிப்பட்ட தகவல்', gu: 'વ્યક્તિગત માહિતી', kn: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ', ml: 'വ്യക്തിഗത വിവരങ്ങൾ', pa: 'ਨਿੱਜੀ जानकारी' },
  fullName: { en: 'Full Name', hi: 'पूरा नाम', bn: 'পুরো নাম', te: 'పూర్తి పేరు', mr: 'पूर्ण नाव', ta: 'முழு பெயர்', gu: 'પૂરું નામ', kn: 'ಪೂರ್ಣ ಹೆಸರು', ml: 'ಪೂರ್ണ്ണനാമം', pa: 'ਪੂਰਾ ਨਾਮ' },
  phoneNumber: { en: 'Phone Number', hi: 'फ़ोन नंबर', bn: 'ফোন নম্বর', te: 'ఫోన్ నంబర్', mr: 'फोन नंबर', ta: 'தொலைபேசி எண்', gu: 'ફોન નંબર', kn: 'ಫೋನ್ ಸಂಖ್ಯೆ', ml: 'ഫോൺ നമ്പർ', pa: 'ਫੋਨ ਨੰਬਰ' },
  state: { en: 'State', hi: 'राज्य', bn: 'রাজ্য', te: 'రాష్ట్రం', mr: 'राज्य', ta: 'மாநிலம்', gu: 'રાજ્ય', kn: 'ರಾಜ್ಯ', ml: 'സംസ്ഥാനം', pa: 'ರಾਜ' },
  district: { en: 'District', hi: 'ज़िला', bn: 'জেলা', te: 'జిల్లా', mr: 'जिल्हा', ta: 'மாவட்டம்', gu: 'જિલ્લો', kn: 'ಜಿಲ್ಲೆ', ml: 'ಜಿಲ್ಲೆ', pa: 'ਜ਼ਿਲ੍ਹਾ' },
  landAcres: { en: 'Land Size (Acres)', hi: 'भूमि का आकार (एकड़)', bn: 'জমির आकार (একর)', te: 'భూమి పరిమాణం (ఎకరాలు)', mr: 'जमिनीचा आकार (एकड़)', ta: 'நிலத்தின் அளவு (ஏக்கர்)', gu: 'જમીનનું માપ (એકર)', kn: 'ಭೂಮಿಯ ಗಾತ್ರ (ಎಕರೆ)', ml: 'ಭೂಮിയുടെ അളവ് (ഏക്കർ)', pa: 'ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ (ਏਕੜ)' },
  crops: { en: 'Crops', hi: 'फसलें', bn: 'ফসল', te: 'పంటలు', mr: 'पिके', ta: 'பயிர்கள்', gu: 'પાક', kn: 'ಬೆಳೆಗಳು', ml: 'വിളകൾ', pa: 'ਫਸਲਾਂ' },
  login: { en: 'Login', hi: 'लॉगिन', bn: 'লগইন', te: 'లాగిన్', mr: 'लॉगिन', ta: 'உள்நுழை', gu: 'લોગિન', kn: 'ಲಾಗಿನ್', ml: 'ലോഗിൻ', pa: 'ਲੌਗਇਨ' },
  sendOtp: { en: 'Send OTP', hi: 'OTP भेजें', bn: 'OTP পাঠান', te: 'OTP పంపండి', mr: 'OTP पाठवा', ta: 'OTP அனுப்பு', gu: 'OTP મોકલો', kn: 'OTP ಕಳುಹಿಸಿ', ml: 'OTP അയയ്ക്കുക', pa: 'OTP ਭੇਜੋ' },
  verify: { en: 'Verify', hi: 'सत्यापित करें', bn: 'যাচাই করুন', te: 'ధృవీకరించండి', mr: 'सत्यापित करा', ta: 'சரிபார்க்கவும்', gu: 'ચકાસો', kn: 'ಪರಿಶೀಲಿಸಿ', ml: 'പരിശോധിക്കുക', pa: 'ਪੁਸ਼ਟੀ ਕਰੋ' },
  logout: { en: 'Logout', hi: 'लॉगआउट', bn: 'লগআউট', te: 'లాగ్అవుట్', mr: 'लॉगआउट', ta: 'வெளியேறு', gu: 'લૉગઆઉટ', kn: 'ಲೋಗೌಟ್', ml: 'ലോഗൗട്ട്', pa: 'ਲੌਗਆਉਟ' },
  getStarted: { en: 'Get Started', hi: 'शुरू करें', bn: 'শুরু করুন', te: 'ప్రారంభించండి', mr: 'सुरु करा', ta: 'தொடங்குங்கள்', gu: 'શરૂ કરો', kn: 'ಪ್ರಾರಂಭಿಸಿ', ml: 'ಆരംഭിക്കുക', pa: 'ਸ਼ੁਰੂ ਕਰੋ' },
  selectLanguage: { en: 'Select Your Language', hi: 'अपनी भाषा चुनें', bn: 'আপনার ভাষা নির্বাচন করুন', te: 'మీ భాషను ఎంచుకోండి', mr: 'तुमची भाषा निवडा', ta: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', gu: 'તમારી ભાષા પસંદ કરો', kn: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', ml: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക', pa: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ' },
  requiredField: { en: 'This field is mandatory', hi: 'यह फ़ील्ड अनिवार्य है', bn: 'এই ক্ষেত্রটি বাধ্যতামূলক', te: 'ఈ ఫీల్డ్ తప్పనిసరి', mr: 'हे फील्ड अनिवार्य आहे', ta: 'இந்த புலம் கட்டாயமாகும்', gu: 'આ ક્ષેત્ર ફરજિયાત છે', kn: 'ಈ ಕ್ಷೇತ್ರವು ಕಡ್ಡಾಯವಾಗಿದೆ', ml: 'ഈ ഫീಲ್ഡ് നിർബന്ധമാണ്', pa: 'ਇਹ ਖੇਤਰ ਲਾਜ਼ਮੀ ਹੈ' },
  otpNotice: { en: 'Your real-time OTP is', hi: 'आपका रीयल-टाइम ओटीपी है', bn: 'আপনার রিয়েল-টাইম ওটিপি হল', te: 'మీ రియల్ టైమ్ OTP', mr: 'तुमचा रिअल-टाइम OTP आहे', ta: 'உங்கள் நிகழ்நேர OTP', gu: 'તમારો રીયલ-ટાઇમ OTP છે', kn: 'ನಿಮ್ಮ ನೈಜ-ಸಮಯದ OTP', ml: 'നിങ്ങളുടെ തത്സമയ OTP', pa: 'ਤੁਹਾਡਾ ਰੀਅਲ-ਟਾਈਮ OTP ਹੈ' },
  enterOtp: { en: 'Enter OTP', hi: 'ओटीपी दर्ज करें', bn: 'ওটিপি লিখুন', te: 'OTP నమోదు చేయండి', mr: 'ओटीपी प्रविष्ट करा', ta: 'OTP ஐ உள்ளிடவும்', gu: 'OTP દાખલ કરો', kn: 'OTP ನಮೂದಿಸಿ', ml: 'OTP നൽകുക', pa: 'ਓਟੀਪੀ ਦਰਜ ਕਰੋ' },
};

export const MOCK_PRICES: CropPrice[] = [
  { crop: 'Wheat (Gehun)', market: 'Azadpur', state: 'Delhi', minPrice: 2400, maxPrice: 2850, modalPrice: 2650, date: '2025-05-20' },
  { crop: 'Rice (Paddy)', market: 'Karnal', state: 'Haryana', minPrice: 3200, maxPrice: 4100, modalPrice: 3800, date: '2025-05-20' },
];

export const MOCK_SCHEMES: Scheme[] = [
  { 
    id: '1', 
    name: 'PM Kisan Samman Nidhi', 
    benefits: '₹6,000 yearly directly to bank', 
    eligibility: 'Small and marginal farmers with landholding', 
    state: 'Central', 
    link: 'https://pmkisan.gov.in/',
    documents: ['Aadhar Card', 'Land Ownership Proof', 'Bank Account Details']
  },
  { 
    id: '2', 
    name: 'Rythu Bandhu', 
    benefits: '₹5,000 per acre per season for seeds and fertilizers', 
    eligibility: 'Farmers in Telangana state', 
    state: 'Telangana', 
    link: 'https://rythubandhu.telangana.gov.in/',
    documents: ['Pattadar Passbook', 'Aadhar Card', 'Bank Passbook']
  },
  { 
    id: '3', 
    name: 'Kisan Credit Card (KCC)', 
    benefits: 'Low interest loans for agricultural needs', 
    eligibility: 'All farmers, including tenant farmers and sharecroppers', 
    state: 'Central', 
    link: 'https://www.sbi.co.in/web/personal-banking/loans/agriculture-banking/kisan-credit-card',
    documents: ['Aadhar Card', 'Proof of Residence', 'Land Record Documents']
  },
  { 
    id: '4', 
    name: 'Soil Health Card Scheme', 
    benefits: 'Soil testing and nutrient recommendations', 
    eligibility: 'All farmers owning land', 
    state: 'Central', 
    link: 'https://www.soilhealth.dac.gov.in/',
    documents: ['Aadhar Card', 'Soil Samples']
  }
];
