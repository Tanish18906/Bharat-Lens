const fs = require('fs');

const TRANSLATIONS_CONTENT = `export const translations = {
  en: {
    // Navbar
    navHome: "Home",
    navChat: "AI Chat",
    navSchemes: "Schemes",
    navVerify: "Verify",
    toggleLang: "Switch to Hindi (हिंदी)",
    navTitle: "Bharat Lens",
    navSubtitle: "भारत लेंस · Citizen Assistant",

    // Home
    heroTitle: "Empowering Citizens with Government Schemes",
    heroSubtitle: "Use our AI Assistant to find your eligibility for 100+ government schemes effortlessly.",
    heroCta: "Talk to AI Assistant",
    orBrowse: "or browse all schemes",
    featScamTitle: "Verify Government Links",
    featScamDesc: "Paste any link to check if it represents a legitimate government scheme or a potential scam.",
    featChatTitle: "AI Scheme Assistant",
    featChatDesc: "Ask our conversational AI in Hindi or English about eligibility, documents, or application forms.",
    featDirTitle: "Scheme Directory",
    featDirDesc: "Search and filter through an exhaustive list of updated Central and Chhattisgarh state schemes.",
    badgeText: "Powered by AI · RAG-enabled · 40 Schemes",
    searchPlaceholder: "e.g., मैं PM Kisan के लिए eligible हूँ?",
    askAi: "Ask AI",
    featuredCategories: "FEATURED CATEGORIES",
    exploreSchemes: "Explore Schemes by Category",
    thousandsBenefits: "Thousands of crores in annual benefits waiting to be claimed",
    findAll: "Find all",
    schemes: "schemes",
    explore: "Explore",
    catAgriculture: "Agriculture",
    catHealth: "Health",
    catEducation: "Education",
    catBusiness: "Business",
    statSchemes: "Schemes Indexed",
    statCitizens: "Citizens Helped",
    statStates: "States Covered",
    statQueries: "Queries Resolved",
    qlKisan: "PM Kisan ₹6,000 payment status",
    qlMahtari: "Mahtari Vandan Yojana eligibility",
    qlAyushman: "Ayushman Bharat hospital list",
    qlMudra: "MUDRA loan application steps",
    qlLpg: "Free LPG connection apply",
    btnChatNow: "Chat Now",
    btnVerifyLink: "Verify Link",
    btnBrowseAll: "Browse All",
    trustTitle: "100% Free · No Data Stored · Official Sources Only",
    trustDesc: "Bharat Lens is a public-interest tool. All scheme information is sourced directly from official Government of India and Chhattisgarh state portals. We never ask for Aadhaar or personal data.",

    // Chat
    chatInputPlaceholder: "Ask me about any scheme, eligibility, or documentation...",
    chatSuggested: "Suggested Questions",
    chatEmptyTitle: "Ask me about any scheme",
    chatEmptySubtitle: "I can help you find eligibility criteria, required documents, and application steps for all Central & State government schemes.",
    chatVoiceListen: "Listening...",
    sqMahtari: "How do I apply for Mahtari Vandan Yojana?",
    sqKisan: "PM Kisan ₹6,000 — am I eligible?",
    sqAyushman: "What documents do I need for Ayushman Bharat?",
    sqMudra: "How to get MUDRA loan for small business?",
    sqPadhai: "Padhai Tuhar Dwar — how to access online classes?",
    sqGodhan: "What is the Godhan Nyay Yojana benefit?",
    chatCopied: "Copied",
    chatCopy: "Copy",
    chatErrorTitle: "Something went wrong",
    chatRetry: "Retry",
    chatErrorMsg: "Failed to get a response. Check your API keys in .env.",
    chatVoiceNotSupported: "Voice input is not supported in this browser. Try Chrome.",
    chatAiTitle: "Bharat Lens AI",
    chatAiStatus: "Online · 40 Schemes · RAG-Enabled",
    chatNew: "New Chat",
    chatFooterText1: "Press ",
    chatFooterText2: "Enter",
    chatFooterText3: " to send · Shift+Enter for new line · Voice in Hindi/English",

    // Schemes
    schTitle: "Government Schemes Directory",
    schSearchPlace: "Search schemes by name, keyword...",
    schBtnClear: "Clear Filters",
    schBtnApply: "Apply",
    schRegion: "Region",
    schCategory: "Category",
    schViewDetails: "View Details",
    schNoResults: "No schemes found matching your criteria.",
    schFilters: "Filters",
    schNoSchemesFound: "No schemes found",
    schTryDifferent: "Try different search terms or clear the filters.",
    schClearAll: "Clear all",
    schClearBtn: "Clear",

    // Scheme Modal
    modCategory: "Category",
    modRegion: "Region",
    modEligibility: "Eligibility Criteria",
    modBenefits: "Benefits",
    modProcess: "Application Process",
    modDocs: "Required Documents",
    modOffSource: "Official Source",
    modHelpdesk: "Helpdesk",
    modClose: "Close",
    modElig: "Eligibility",
    modBen: "Benefits",
    modAppProc: "Application Process",
    modDocsReq: "Documents Required",
    modHelpdeskTitle: "HELPDESK",
    modApplyNow: "Apply Now – Official Portal",

    // Verify
    verTitle: "Scheme Verification Center",
    verSubtitle: "Paste a link or message to check if it's a legitimate government scheme or a scam.",
    verInputPlaceholder: "Enter website link (e.g., pmkisan.gov-update.in) or SMS text...",
    verBtnCheck: "Verify Now",
    verBtnClear: "Clear",
    verSecTitle: "Why Verify?",
    verSecDesc1: "Beware of fake websites asking for registration fees.",
    verSecDesc2: "Official government websites usually end with .gov.in or .nic.in.",
    verSecDesc3: "Do not share OTPs, PINs, or Aadhaar details on suspicious links.",
    tip1: "Real government sites always end in .gov.in or .nic.in",
    tip2: "Government never asks for OTP or bank PIN via SMS/WhatsApp",
    tip3: "Shortened URLs (bit.ly, tinyurl) are major red flags",
    tip4: "If in doubt, call the official helpline — never click the link",
    tip5: "No government scheme asks for payment to 'release' your benefit",
    exKisan: "Official PM-KISAN Site",
    exSms: "Suspicious Scheme SMS",
    exKyc: "Fake Aadhaar KYC",
    exAyushman: "Ayushman Bharat Portal",
    verUrlLink: "URL / Link",
    verSmsWa: "SMS / WhatsApp",
    verChecking: "Checking...",
    verTryExample: "TRY AN EXAMPLE",
    verVerifiedGov: "✓ Verified .gov.in domain",
    verNotGov: "Not a .gov.in domain",
    verLinkDetected: " · Link detected",
    verRiskScore: "RISK SCORE",
    verIssues: "DETECTED ISSUES",
    verReportScam: "Report This Scam",
    verCallHelpline: "Call Cyber Crime Helpline 1930 or visit cybercrime.gov.in",
    verStaySafe: "How to Stay Safe Online",
    verFooter: "Cyber Crime Helpline: 1930 · Report at cybercrime.gov.in",
  },
  hi: {
    // Navbar
    navHome: "होम",
    navChat: "एआई चैट",
    navSchemes: "योजनाएं",
    navVerify: "सत्यापन",
    toggleLang: "Switch to English (EN)",
    navTitle: "भारत लेंस",
    navSubtitle: "भारत लेंस · नागरिक सहायक",

    // Home
    heroTitle: "सरकारी योजनाओं के साथ नागरिकों का सशक्तिकरण",
    heroSubtitle: "100+ सरकारी योजनाओं के लिए अपनी पात्रता आसानी से जानने के लिए हमारे एआई (AI) असिस्टेंट का उपयोग करें।",
    heroCta: "एआई से बात करें",
    orBrowse: "या सभी योजनाएं ब्राउज़ करें",
    featScamTitle: "लिंक सत्यापित करें",
    featScamDesc: "किसी भी लिंक को पेस्ट करके जांचें कि क्या यह वैध सरकारी योजना है या कोई स्कैम (धोखाधड़ी)।",
    featChatTitle: "एआई योजना असिस्टेंट",
    featChatDesc: "हमारे एआई से हिंदी या अंग्रेजी में पात्रता, दस्तावेज़ या आवेदन प्रपत्र के बारे में पूछें।",
    featDirTitle: "योजना निर्देशिका",
    featDirDesc: "अद्यतन केंद्रीय और राज्य (छत्तीसगढ़) योजनाओं की विस्तृत सूची खोजें और फ़िल्टर करें।",
    badgeText: "एआई द्वारा संचालित · आरएजी सक्षम · 40 योजनाएं",
    searchPlaceholder: "उदाहरण के लिए, क्या मैं पीएम किसान के लिए पात्र हूं?",
    askAi: "एआई से पूछें",
    featuredCategories: "विशेष श्रेणियां",
    exploreSchemes: "श्रेणी के अनुसार योजनाएं एक्सप्लोर करें",
    thousandsBenefits: "दावा किए जाने की प्रतीक्षा में करोड़ों रुपये के वार्षिक लाभ",
    findAll: "सभी खोजें",
    schemes: "योजनाएं",
    explore: "एक्सप्लोर करें",
    catAgriculture: "कृषि",
    catHealth: "स्वास्थ्य",
    catEducation: "शिक्षा",
    catBusiness: "व्यापार",
    statSchemes: "योजनाएं अनुक्रमित",
    statCitizens: "नागरिकों की मदद की",
    statStates: "शामिल राज्य",
    statQueries: "प्रश्नों का समाधान",
    qlKisan: "पीएम किसान ₹6,000 भुगतान स्थिति",
    qlMahtari: "महतारी वंदन योजना पात्रता",
    qlAyushman: "आयुष्मान भारत अस्पताल सूची",
    qlMudra: "मुद्रा ऋण आवेदन प्रक्रिया",
    qlLpg: "मुफ्त एलपीजी कनेक्शन आवेदन",
    btnChatNow: "अभी चैट करें",
    btnVerifyLink: "लिंक सत्यापित करें",
    btnBrowseAll: "सभी ब्राउज़ करें",
    trustTitle: "100% मुफ़्त · कोई डेटा संग्रहीत नहीं · केवल आधिकारिक स्रोत",
    trustDesc: "भारत लेंस जनहित का टूल है। सभी योजना जानकारी सीधे आधिकारिक भारत सरकार और छत्तीसगढ़ राज्य पोर्टल्स से प्राप्त की जाती है। हम कभी भी आधार या व्यक्तिगत डेटा नहीं मांगते हैं।",

    // Chat
    chatInputPlaceholder: "योजना, पात्रता या दस्तावेज़ के बारे में पूछें...",
    chatSuggested: "सुझाए गए प्रश्न",
    chatEmptyTitle: "योजनाओं के बारे में पूछें",
    chatEmptySubtitle: "मैं केंद्र और राज्य सरकार की योजनाओं के लिए पात्रता, दस्तावेज़ और आवेदन प्रक्रिया खोजने में आपकी मदद कर सकता हूं।",
    chatVoiceListen: "सुन रहा हूँ...",
    sqMahtari: "मैं महतारी वंदन योजना के लिए आवेदन कैसे करूं?",
    sqKisan: "पीएम किसान ₹6,000 — क्या मैं पात्र हूं?",
    sqAyushman: "आयुष्मान भारत के लिए मुझे किन दस्तावेजों की आवश्यकता है?",
    sqMudra: "छोटे व्यवसाय के लिए मुद्रा ऋण कैसे प्राप्त करें?",
    sqPadhai: "पढ़ई तुंहर दुआर — ऑनलाइन कक्षाओं तक कैसे पहुंचें?",
    sqGodhan: "गोधन न्याय योजना का लाभ क्या है?",
    chatCopied: "कॉपी किया गया",
    chatCopy: "कॉपी करें",
    chatErrorTitle: "कुछ गलत हो गया",
    chatRetry: "पुनः प्रयास करें",
    chatErrorMsg: "प्रतिक्रिया प्राप्त करने में विफल। .env में अपनी API कुंजी जांचें।",
    chatVoiceNotSupported: "इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। क्रोम आज़माएं।",
    chatAiTitle: "भारत लेंस एआई",
    chatAiStatus: "ऑनलाइन · 40 योजनाएं · RAG-सक्षम",
    chatNew: "नई चैट",
    chatFooterText1: "भेजने के लिए ",
    chatFooterText2: "Enter",
    chatFooterText3: " दबाएं · नई लाइन के लिए Shift+Enter · हिंदी/अंग्रेजी में वॉइस",

    // Schemes
    schTitle: "सरकारी योजना निर्देशिका",
    schSearchPlace: "योजना का नाम, कीवर्ड द्वारा खोजें...",
    schBtnClear: "फ़िल्टर हटाएं",
    schBtnApply: "लागू करें",
    schRegion: "क्षेत्र",
    schCategory: "श्रेणी",
    schViewDetails: "विवरण देखें",
    schNoResults: "आपकी खोज से मेल खाने वाली कोई योजना नहीं मिली।",
    schFilters: "फ़िल्टर",
    schNoSchemesFound: "कोई योजना नहीं मिली",
    schTryDifferent: "विभिन्न खोज शब्दों का प्रयास करें या फ़िल्टर साफ़ करें।",
    schClearAll: "सभी साफ़ करें",
    schClearBtn: "साफ़ करें",

    // Scheme Modal
    modCategory: "श्रेणी",
    modRegion: "क्षेत्र",
    modEligibility: "पात्रता मानदंड",
    modBenefits: "लाभ",
    modProcess: "आवेदन प्रक्रिया",
    modDocs: "आवश्यक दस्तावेज़",
    modOffSource: "आधिकारिक स्रोत",
    modHelpdesk: "हेल्पडेस्क",
    modClose: "बंद करें",
    modElig: "पात्रता",
    modBen: "लाभ",
    modAppProc: "आवेदन प्रक्रिया",
    modDocsReq: "आवश्यक दस्तावेज़",
    modHelpdeskTitle: "हेल्पडेस्क",
    modApplyNow: "अभी आवेदन करें - आधिकारिक पोर्टल",

    // Verify
    verTitle: "योजना सत्यापन केंद्र",
    verSubtitle: "यह जांचने के लिए कि योजना वैध है या स्कैम, लिंक या संदेश पेस्ट करें।",
    verInputPlaceholder: "वेबसाइट लिंक (जैसे pmkisan.gov.in) या SMS टेक्स्ट दर्ज करें...",
    verBtnCheck: "अभी सत्यापित करें",
    verBtnClear: "साफ़ करें",
    verSecTitle: "सत्यापन क्यों?",
    verSecDesc1: "पंजीकरण शुल्क मांगने वाली फर्जी वेबसाइटों से सावधान रहें।",
    verSecDesc2: "आधिकारिक सरकारी वेबसाइटें आमतौर पर .gov.in या .nic.in के साथ समाप्त होती हैं।",
    verSecDesc3: "संदिग्ध लिंक पर OTP, पिन या आधार विवरण साझा न करें।",
    tip1: "असली सरकारी साइटें हमेशा .gov.in या .nic.in पर समाप्त होती हैं",
    tip2: "सरकार कभी भी SMS/WhatsApp के माध्यम से OTP या बैंक पिन नहीं मांगती",
    tip3: "लघु URL (bit.ly, tinyurl) प्रमुख खतरे के संकेत हैं",
    tip4: "यदि संदेह हो, সমগ্র हेल्पलाइन पर कॉल करें — लिंक पर कभी क्लिक न करें",
    tip5: "कोई भी सरकारी योजना आपका लाभ 'जारी' करने के लिए भुगतान नहीं मांगती",
    exKisan: "आधिकारिक पीएम-किसान साइट",
    exSms: "संदिग्ध योजना SMS",
    exKyc: "फर्जी आधार KYC",
    exAyushman: "आयुष्मान भारत पोर्टल",
    verUrlLink: "यूआरएल / लिंक",
    verSmsWa: "एसएमएस / व्हाट्सएप",
    verChecking: "जांच कर रहा है...",
    verTryExample: "एक उदाहरण आज़माएं",
    verVerifiedGov: "✓ सत्यापित .gov.in डोमेन",
    verNotGov: ".gov.in डोमेन नहीं है",
    verLinkDetected: " · लिंक का पता चला",
    verRiskScore: "जोखिम स्कोर",
    verIssues: "पता चले मुद्दे",
    verReportScam: "इस स्कैम की रिपोर्ट करें",
    verCallHelpline: "साइबर क्राइम हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर जाएं",
    verStaySafe: "ऑनलाइन सुरक्षित कैसे रहें",
    verFooter: "साइबर क्राइम हेल्पलाइन: 1930 · cybercrime.gov.in पर रिपोर्ट करें",
  }
};
`;
fs.writeFileSync('src/data/translations.js', TRANSLATIONS_CONTENT);

// Replace in Home.jsx
let home = fs.readFileSync('src/pages/Home.jsx', 'utf8');

home = home.replace(
  /const CATEGORIES = \[\s*\{ label: "Agriculture"[^\]]*\];/m,
  `const CATEGORIES = [\n  { labelKey: "catAgriculture", icon: Wheat,          color: "#16A34A", bg: "#F0FDF4", query: "Agriculture" },\n  { labelKey: "catHealth",      icon: HeartPulse,      color: "#DC2626", bg: "#FFF5F5", query: "Health"      },\n  { labelKey: "catEducation",   icon: GraduationCap,   color: "#2563EB", bg: "#EFF6FF", query: "Education"   },\n  { labelKey: "catBusiness",    icon: Briefcase,       color: "#D97706", bg: "#FFFBEB", query: "Business"    },\n];`
);

home = home.replace(
  /\{CATEGORIES\.map\(\(\{ label, icon: Icon, color, bg, query: q \}\) => \(/g,
  `{CATEGORIES.map(({ labelKey, icon: Icon, color, bg, query: q }) => (`
);
home = home.replace(/key=\{label\}/g, `key={labelKey}`);
home = home.replace(
  /\{label\}\n\s*<\/div>/g,
  `{t(labelKey)}\n              </div>`
);
home = home.replace(
  /\{t\('findAll'\)\} \{label\.toLowerCase\(\)\} \{t\('schemes'\)\}/g,
  `{t('findAll')} {t(labelKey)} {t('schemes')}`
);

home = home.replace(
  /const STATS = \[\s*\{ label: "Schemes Indexed"[^\]]*\];/m,
  `const STATS = [\n  { labelKey: "statSchemes",  value: "40+",  icon: "📋" },\n  { labelKey: "statCitizens",  value: "1K+",  icon: "👥" },\n  { labelKey: "statStates",   value: "2",    icon: "🗺️" },\n  { labelKey: "statQueries", value: "500+", icon: "✅" },\n];`
);
home = home.replace(/key=\{s\.label\}/g, `key={s.labelKey}`);
home = home.replace(
  /\{s\.label\}<\/div>/g,
  `{t(s.labelKey)}</div>`
);

home = home.replace(
  /const QUICK_LINKS = \[\s*"PM Kisan ₹6,000 payment status"[^\]]*\];/m,
  `const QUICK_LINKS = [\n  { textKey: "qlKisan", query: "PM Kisan ₹6,000 payment status" },\n  { textKey: "qlMahtari", query: "Mahtari Vandan Yojana eligibility" },\n  { textKey: "qlAyushman", query: "Ayushman Bharat hospital list" },\n  { textKey: "qlMudra", query: "MUDRA loan application steps" },\n  { textKey: "qlLpg", query: "Free LPG connection apply" },\n];`
);
home = home.replace(/key=\{q\}/g, `key={q.textKey}`);
home = home.replace(
  /onClick=\{\(\) => navigate\(\`\/chat\?q=\$\{encodeURIComponent\(q\)\}\`\)\}/g,
  `onClick={() => navigate(\`/chat?q=\${encodeURIComponent(q.query)}\`)}`
);
home = home.replace(
  />\n\s*\{q\}\n\s*<\/button>/g,
  `>\n                {t(q.textKey)}\n              </button>`
);

home = home.replace(/cta="Chat Now"/g, `cta={t('btnChatNow')}`);
home = home.replace(/cta="Verify Link"/g, `cta={t('btnVerifyLink')}`);
home = home.replace(/cta="Browse All"/g, `cta={t('btnBrowseAll')}`);

home = home.replace(
  /100% Free · No Data Stored · Official Sources Only\n\s*<\/div>\n\s*<p style=\{\{ color: "#166534", fontSize: 13, lineHeight: 1\.6 \}\}>\n\s*Bharat Lens is a public-interest tool\. All scheme information is sourced directly from\n\s*official Government of India and Chhattisgarh state portals\. We never ask for Aadhaar or personal data\.\n\s*<\/p>/g,
  `{t('trustTitle')}\n            </div>\n            <p style={{ color: "#166534", fontSize: 13, lineHeight: 1.6 }}>\n              {t('trustDesc')}\n            </p>`
);

fs.writeFileSync('src/pages/Home.jsx', home);


// Replace in Chat.jsx
let chat = fs.readFileSync('src/pages/Chat.jsx', 'utf8');

chat = chat.replace(/function MessageBubble\(\{ msg, onCopy \}\) \{/g, `function MessageBubble({ msg, onCopy }) {\n  const { t } = useLanguage();`);
chat = chat.replace(/\{copied \? "Copied" : "Copy"\}/g, `{copied ? t('chatCopied') : t('chatCopy')}`);

chat = chat.replace(/function ErrorMessage\(\{ error, onRetry \}\) \{/g, `function ErrorMessage({ error, onRetry }) {\n  const { t } = useLanguage();`);
chat = chat.replace(/>\n\s*Something went wrong\n\s*<\/div>/g, `>\n          {t('chatErrorTitle')}\n        </div>`);
chat = chat.replace(/<RotateCcw size=\{12\} \/> Retry/g, `<RotateCcw size={12} /> {t('chatRetry')}`);

chat = chat.replace(/"Failed to get a response\. Check your API keys in \.env\."/g, `t('chatErrorMsg')`);
chat = chat.replace(/"Voice input is not supported in this browser\. Try Chrome\."/g, `t('chatVoiceNotSupported')`);

chat = chat.replace(
  /const SUGGESTED_QUESTIONS = \[\s*\{ text: "How do I apply for Mahtari Vandan Yojana\?"[^\]]*\];/m,
  `const SUGGESTED_QUESTIONS = [\n  { textKey: "sqMahtari", query: "How do I apply for Mahtari Vandan Yojana?", emoji: "👩" },\n  { textKey: "sqKisan", query: "PM Kisan ₹6,000 — am I eligible?", emoji: "🌾" },\n  { textKey: "sqAyushman", query: "What documents do I need for Ayushman Bharat?", emoji: "🏥" },\n  { textKey: "sqMudra", query: "How to get MUDRA loan for small business?", emoji: "💼" },\n  { textKey: "sqPadhai", query: "Padhai Tuhar Dwar — how to access online classes?", emoji: "📚" },\n  { textKey: "sqGodhan", query: "What is the Godhan Nyay Yojana benefit?", emoji: "🐄" },\n];`
);
chat = chat.replace(/onClick=\{\(\) => handleSuggestion\(sq\.text\)\}/g, `onClick={() => handleSuggestion(sq.query)}`);
chat = chat.replace(/\{sq\.text\}/g, `{t(sq.textKey)}`);

chat = chat.replace(/>Bharat Lens AI<\/div>/g, `>{t('chatAiTitle')}</div>`);
chat = chat.replace(/Online · 40 Schemes · RAG-Enabled/g, `{t('chatAiStatus')}`);
chat = chat.replace(/<RotateCcw size=\{13\} \/> New Chat/g, `<RotateCcw size={13} /> {t('chatNew')}`);
chat = chat.replace(
  /Press <kbd([^>]*)>Enter<\/kbd> to send · Shift\+Enter for new line · Voice in Hindi\/English/g,
  `{t('chatFooterText1')}<kbd$1>{t('chatFooterText2')}</kbd>{t('chatFooterText3')}`
);

fs.writeFileSync('src/pages/Chat.jsx', chat);

// Schemes.jsx
let schemes = fs.readFileSync('src/pages/Schemes.jsx', 'utf8');
schemes = schemes.replace(/<SlidersHorizontal size=\{15\} \/>\n\s*Filters/g, `<SlidersHorizontal size={15} />\n              {t('schFilters')}`);
schemes = schemes.replace(/<X size=\{12\} \/> Clear all/g, `<X size={12} /> {t('schClearAll')}`);
schemes = schemes.replace(/>No schemes found<\/h3>/g, `>{t('schNoSchemesFound')}</h3>`);
schemes = schemes.replace(/>Try different search terms or clear the filters\.<\/p>/g, `>{t('schTryDifferent')}</p>`);
schemes = schemes.replace(/<SlidersHorizontal size=\{15\} \/> Filters/g, `<SlidersHorizontal size={15} /> {t('schFilters')}`);
schemes = schemes.replace(/>Clear<\/button>/g, `>{t('schClearBtn')}</button>`);
fs.writeFileSync('src/pages/Schemes.jsx', schemes);

// Verify.jsx
let verify = fs.readFileSync('src/pages/Verify.jsx', 'utf8');

verify = verify.replace(
  /const SCAM_TIPS = \[\s*\{ icon: "🔒"[^\]]*\];/m,
  `const SCAM_TIPS = [\n  { icon: "🔒", tipKey: "tip1" },\n  { icon: "📵", tipKey: "tip2" },\n  { icon: "🚫", tipKey: "tip3" },\n  { icon: "📞", tipKey: "tip4" },\n  { icon: "💸", tipKey: "tip5" },\n];`
);
verify = verify.replace(/\{SCAM_TIPS\.map\(\(\{ icon, tip \}, i\) => \(/g, `{SCAM_TIPS.map(({ icon, tipKey }, i) => (`);
verify = verify.replace(/>\{tip\}<\/p>/g, `>{t(tipKey)}</p>`);

verify = verify.replace(
  /const EXAMPLE_INPUTS = \[\s*\{ label: "Official PM-KISAN Site"[^\]]*\];/m,
  `const EXAMPLE_INPUTS = [\n  { labelKey: "exKisan",    value: "https://pmkisan.gov.in",                                    type: "URL" },\n  { labelKey: "exSms",    value: "Congratulations! Claim your ₹10,000 PM relief fund: bit.ly/pm-relief-2024", type: "SMS" },\n  { labelKey: "exKyc",         value: "Urgent: Your Aadhaar is suspended. Verify KYC now: tinyurl.com/aadhar-kyc", type: "SMS" },\n  { labelKey: "exAyushman",   value: "https://pmjay.gov.in",                                       type: "URL" },\n];`
);
verify = verify.replace(/key=\{ex\.label\}/g, `key={ex.labelKey}`);
verify = verify.replace(/>\n\s*\{ex\.label\}\n\s*<\/button>/g, `>\n                {t(ex.labelKey)}\n              </button>`);

verify = verify.replace(/label: "URL \/ Link"/g, `label: t("verUrlLink")`);
verify = verify.replace(/label: "SMS \/ WhatsApp"/g, `label: t("verSmsWa")`);
verify = verify.replace(/loading \? "Checking\.\.\." : t\('verBtnCheck'\)/g, `loading ? t('verChecking') : t('verBtnCheck')`);
verify = verify.replace(/TRY AN EXAMPLE/g, `{t('verTryExample')}`);
verify = verify.replace(/"✓ Verified \.gov\.in domain"/g, `t('verVerifiedGov')`);
verify = verify.replace(/"Not a \.gov\.in domain"/g, `t('verNotGov')`);
verify = verify.replace(/` · Link detected`/g, `t('verLinkDetected')`);
verify = verify.replace(/RISK SCORE/g, `{t('verRiskScore')}`);
verify = verify.replace(/DETECTED ISSUES/g, `{t('verIssues')}`);
verify = verify.replace(/>\n\s*Report This Scam\n\s*<\/div>/g, `>\n                    {t('verReportScam')}\n                  </div>`);

// Handle tricky HTML replacements
verify = verify.replace(
  /Call Cyber Crime Helpline <strong>1930<\/strong> or visit\{" "\}\n\s*<a href="https:\/\/cybercrime\.gov\.in" target="_blank" rel="noopener noreferrer"\n\s*style=\{\{ color: "#DC2626", fontWeight: 600 \}\}>\n\s*cybercrime\.gov\.in <ExternalLink size=\{10\} style=\{\{ verticalAlign: "middle" \}\} \/>\n\s*<\/a>/g,
  `{t('verCallHelpline').split("cybercrime.gov.in")[0]}\n                    <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"\n                      style={{ color: "#DC2626", fontWeight: 600 }}>\n                      cybercrime.gov.in <ExternalLink size={10} style={{ verticalAlign: "middle" }} />\n                    </a>\n                    {t('verCallHelpline').split("cybercrime.gov.in")[1]}`
);

verify = verify.replace(/>\n\s*How to Stay Safe Online\n\s*<\/h2>/g, `>\n          {t('verStaySafe')}\n        </h2>`);

verify = verify.replace(
  /Cyber Crime Helpline: <strong>1930<\/strong> · Report at\{" "\}\n\s*<a href="https:\/\/cybercrime\.gov\.in" target="_blank" rel="noopener noreferrer"\n\s*style=\{\{ color: "var\(--india-green\)", fontWeight: 600, textDecoration: "none" \}\}>\n\s*cybercrime\.gov\.in\n\s*<\/a>/g,
  `{t('verFooter').split("cybercrime.gov.in")[0]}\n          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"\n            style={{ color: "var(--india-green)", fontWeight: 600, textDecoration: "none" }}>\n            cybercrime.gov.in\n          </a>\n          {t('verFooter').split("cybercrime.gov.in")[1]}`
);

fs.writeFileSync('src/pages/Verify.jsx', verify);

// Navbar.jsx
let navbar = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
navbar = navbar.replace(/>\n\s*Bharat Lens\n\s*<\/div>/g, `>\n                {t('navTitle')}\n              </div>`);
navbar = navbar.replace(/>\n\s*भारत लेंस · Citizen Assistant\n\s*<\/div>/g, `>\n                {t('navSubtitle')}\n              </div>`);
fs.writeFileSync('src/components/Navbar.jsx', navbar);

// SchemeModal.jsx
let modal = fs.readFileSync('src/components/SchemeModal.jsx', 'utf8');
modal = modal.replace(/import \{ CATEGORY_ICONS \} from "\.\.\/data\/schemes";/g, `import { CATEGORY_ICONS } from "../data/schemes";\nimport { useLanguage } from "../LanguageContext";`);
modal = modal.replace(/export default function SchemeModal\(\{ scheme, onClose \}\) \{/g, `export default function SchemeModal({ scheme, onClose }) {\n  const { t } = useLanguage();`);
modal = modal.replace(/title="Eligibility"/g, `title={t('modElig')}`);
modal = modal.replace(/title="Benefits"/g, `title={t('modBen')}`);
modal = modal.replace(/title="Application Process"/g, `title={t('modAppProc')}`);
modal = modal.replace(/title="Documents Required"/g, `title={t('modDocsReq')}`);
modal = modal.replace(/>\n\s*HELPDESK\n\s*<\/div>/g, `>\n                {t('modHelpdeskTitle')}\n              </div>`);
modal = modal.replace(/>\n\s*Apply Now – Official Portal\n\s*<ExternalLink size=\{15\} \/>/g, `>\n            {t('modApplyNow')}\n            <ExternalLink size={15} />`);
fs.writeFileSync('src/components/SchemeModal.jsx', modal);
