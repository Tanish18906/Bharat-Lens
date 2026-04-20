// src/services/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Bharat Lens – RAG Service Layer
// Integrates: OpenAI Embeddings → Pinecone Vector Search → GPT-4o Mini (RAG)
// ─────────────────────────────────────────────────────────────────────────────

const OPENAI_API_KEY  = import.meta.env.VITE_OPENAI_API_KEY;
const PINECONE_API_KEY = import.meta.env.VITE_PINECONE_API_KEY;
const PINECONE_HOST    = import.meta.env.VITE_PINECONE_HOST; // e.g. https://scheme-data-xxxxx.svc.region.pinecone.io

const EMBEDDING_MODEL  = "text-embedding-3-small";
const CHAT_MODEL       = "gpt-4o-mini";

function detectRequestedReplyStyle(userQuery, history = []) {
  const recentUserTexts = [
    userQuery,
    ...[...history]
      .reverse()
      .filter(m => m?.role === "user")
      .slice(0, 10)
      .map(m => m?.content || ""),
  ];

  const hasAny = (text, patterns) => patterns.some(pattern => pattern.test(text));

  for (const rawText of recentUserTexts) {
    const text = String(rawText || "").toLowerCase();
    if (!text) continue;

    const wantsHindi = hasAny(text, [
      /\bin hindi\b/,
      /\bpure hindi\b/,
      /\bhindi me\b/,
      /\bhindi mein\b/,
      /हिंदी में/,
      /शुद्ध हिंदी/,
      /देवनागरी/,
      /हिन्दी में/,
    ]);
    if (wantsHindi) return "hindi";

    const wantsHinglish = hasAny(text, [
      /\bin hinglish\b/,
      /\bhinglish\b/,
      /हिंग्लिश/,
    ]);
    if (wantsHinglish) return "hinglish";

    const wantsEnglish = hasAny(text, [
      /\bin english\b/,
      /\benglish me\b/,
      /\benglish mein\b/,
      /अंग्रेजी में/,
      /english only/,
    ]);
    if (wantsEnglish) return "english";
  }

  return null;
}

// ── Scam Detection Heuristics ─────────────────────────────────────────────────
const GOV_DOMAIN_PATTERN = /\.gov\.in(\/|$)/i;
const SUSPICIOUS_PATTERNS = [
  /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|rb\.gy/i,          // URL shorteners
  /free.*money|cash.*prize|lottery|winner.*claim/i,          // Prize scams
  /verify.*aadhaar.*urgent|urgent.*kyc.*update/i,            // KYC scams
  /account.*suspend.*click|block.*account.*link/i,           // Account suspension
  /pm.*relief.*fund.*transfer|modi.*welfare.*fund/i,         // Fake PM schemes
  /whatsapp.*government.*benefit.*link/i,                    // WhatsApp scams
  /subsidy.*click.*link.*now|subsid.*apply.*today.*only/i,   // Fake subsidy
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. Get Embedding from OpenAI
// ─────────────────────────────────────────────────────────────────────────────
export async function getEmbedding(text) {
  if (!OPENAI_API_KEY) throw new Error("VITE_OPENAI_API_KEY is not set in .env");

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenAI Embedding error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding; // 1536-dim vector
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Query Pinecone for Top-K similar scheme chunks
// ─────────────────────────────────────────────────────────────────────────────
export async function queryPinecone(embedding, topK = 3) {
  if (!PINECONE_API_KEY) throw new Error("VITE_PINECONE_API_KEY is not set in .env");
  if (!PINECONE_HOST)    throw new Error("VITE_PINECONE_HOST is not set in .env");

  const response = await fetch(`${PINECONE_HOST}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": PINECONE_API_KEY,
    },
    body: JSON.stringify({
      vector: embedding,
      topK,
      includeMetadata: true,
      namespace: "",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Pinecone query error: ${err.message || response.statusText}`);
  }

  const data = await response.json();
  return data.matches || [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Generate RAG Response with GPT-4o Mini
// ─────────────────────────────────────────────────────────────────────────────
export async function generateRAGResponse(userQuery, contextChunks, history = [], lang = 'en') {
  if (!OPENAI_API_KEY) throw new Error("VITE_OPENAI_API_KEY is not set in .env");

  // Build context string from Pinecone matches
  const contextText = contextChunks
    .map((match, i) => {
      const meta = match.metadata || {};
      const source = meta.scheme_name || meta.source || `Scheme ${i + 1}`;
      const text   = meta.text || meta.content || JSON.stringify(meta);
      return `--- Source ${i + 1}: ${source} ---\n${text}`;
    })
    .join("\n\n");

  const appLanguage = lang === 'hi' ? 'Hindi' : 'English';
  const requestedStyle = detectRequestedReplyStyle(userQuery, history);
  const explicitStyleInstruction = requestedStyle === "hindi"
    ? "The user explicitly asked for Hindi. Reply in pure Hindi (Devanagari script). Avoid English words except unavoidable proper nouns/scheme names."
    : requestedStyle === "hinglish"
      ? "The user explicitly asked for Hinglish. Reply in Hinglish (Hindi in English alphabet, natural conversational style)."
      : requestedStyle === "english"
        ? "The user explicitly asked for English. Reply fully in English."
        : "No explicit language override found.";

  const languageInstruction = `LANGUAGE POLICY (strict):
1. Highest priority: If the user explicitly asks for a reply language (Hindi/Hinglish/English), follow that request even if the request sentence is written in another language.
2. If user says Hindi or pure Hindi, reply in pure Hindi (Devanagari script).
3. If user says Hinglish, reply in Hinglish.
4. If user says English, reply in English.
5. If no explicit request, mirror the user's latest input style exactly (English -> English, Hinglish -> Hinglish, Hindi -> Hindi).
6. If still ambiguous, prefer ${appLanguage}.
Current explicit style decision: ${explicitStyleInstruction}`;

  const systemPrompt = `You are "Bharat Lens AI," a helpful and trusted assistant for Indian citizens seeking information about Central and Chhattisgarh state government schemes and benefits.

Your ONLY job is to answer questions using the provided CONTEXT below. 

Rules you must always follow:
1. Only use information from the CONTEXT. Do NOT fabricate scheme details, eligibility, or amounts.
2. If the answer is not in the context, say: "I don't have specific information on this in my current database. For accurate details, please call the official helpline 1800-11-1956 (Central Government scheme info) or visit india.gov.in."
3. Always be polite and empathetic. Many users are rural citizens with limited digital literacy.
4. When you mention a scheme, state the official source/helpline if available in context.
5. Respond in simple, clear language. Avoid bureaucratic jargon.
6. ${languageInstruction}

CONTEXT:
${contextText || "No relevant schemes found in the database for this query."}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: "system",    content: systemPrompt },
        ...history,
        { role: "user",      content: userQuery    },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`GPT-4o Mini error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Master Search Function (Embedding → Pinecone → GPT-4o Mini)
// ─────────────────────────────────────────────────────────────────────────────
export async function searchSchemes(query, history = [], lang = 'en') {
  // Step 1: Embed the query
  // To handle follow-up questions (like "what about eligibility?"), we append the last 
  // user message to the current query so Pinecone gets the entity context (e.g. "PM Kisan").
  let searchQuery = query;
  const lastUserMsg = [...history].reverse().find(m => m.role === 'user');
  if (lastUserMsg) {
    searchQuery = `${lastUserMsg.content} ${query}`;
  }
  
  const embedding = await getEmbedding(searchQuery);

  // Step 2: Query Pinecone for top-3 relevant chunks
  const matches = await queryPinecone(embedding, 3);

  // Step 3: Extract source labels for display
  const sources = matches
    .filter(m => m.score > 0.35) // relevance threshold
    .map(m => ({
      name:  m.metadata?.scheme_name || m.metadata?.source || "Government Scheme",
      score: m.score,
      url:   m.metadata?.official_url || null,
    }));

  // Step 4: Generate RAG response
  const answer = await generateRAGResponse(query, matches, history, lang);

  return { answer, sources };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Scam / Link Verification
// ─────────────────────────────────────────────────────────────────────────────
export function verifyLink(input) {
  const trimmed = input.trim();

  // Check if it's a URL
  let isUrl = false;
  let urlObj = null;
  try {
    urlObj = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    isUrl = true;
  } catch {
    isUrl = false;
  }

  const suspiciousMatches = SUSPICIOUS_PATTERNS.filter(p => p.test(trimmed));
  const isGovDomain = isUrl && GOV_DOMAIN_PATTERN.test(urlObj?.hostname || "");

  // Score: 0 = safe, 100 = very likely scam
  let riskScore = 0;
  const flags   = [];

  if (suspiciousMatches.length > 0) {
    riskScore += suspiciousMatches.length * 30;
    flags.push(...suspiciousMatches.map(p => `Matched suspicious pattern: ${p.toString().slice(1, 40)}`));
  }

  if (isUrl) {
    const host = urlObj.hostname;

    // Typosquatting common gov sites
    const typosquat = [
      /pmkisan-gov\.in|pm-kisan\.in|pmkisan\.co/i,
      /ayushman-bharat\.co|pmjay-india\.in/i,
      /india-gov\.in|indiagovernment\./i,
      /ration-card-apply\.|pm-relief-fund\./i,
    ];
    if (typosquat.some(t => t.test(host))) {
      riskScore += 70;
      flags.push("Domain imitates official government website (typosquatting)");
    }

    if (!isGovDomain && host.includes("gov")) {
      riskScore += 20;
      flags.push("Contains 'gov' but not a verified .gov.in domain");
    }

    if (urlObj.protocol === "http:" && !isGovDomain) {
      riskScore += 20;
      flags.push("Uses insecure HTTP connection");
    }
  }

  riskScore = Math.min(riskScore, 100);

  let verdict, color, detail, advice;

  if (isGovDomain && riskScore < 20) {
    verdict = "Verified Government Site";
    color   = "green";
    detail  = `✅ This appears to be an official .gov.in domain. Government of India portals use .gov.in or .nic.in suffixes.`;
    advice  = "You can generally trust this source. Always verify you typed the URL correctly.";
  } else if (riskScore >= 60) {
    verdict = "High Risk – Likely Scam";
    color   = "red";
    detail  = "🚨 Multiple indicators of a scam detected.";
    advice  = "Do NOT click this link or share personal/banking details. Report to cybercrime.gov.in or call 1930.";
  } else if (riskScore >= 25) {
    verdict = "Suspicious – Proceed with Caution";
    color   = "orange";
    detail  = "⚠️ Some suspicious indicators found. This may not be an official government source.";
    advice  = "Verify by searching the official scheme name on india.gov.in before proceeding.";
  } else {
    verdict = "No Obvious Red Flags";
    color   = "yellow";
    detail  = "🔍 No obvious scam patterns detected, but this is not a verified government domain.";
    advice  = "Cross-check this information on official government portals (india.gov.in, cgstate.gov.in).";
  }

  return {
    verdict,
    color,
    riskScore,
    isUrl,
    isGovDomain,
    flags,
    detail,
    advice,
  };
}
