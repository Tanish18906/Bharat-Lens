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
  const languageInstruction = `VERY IMPORTANT: You MUST respond in the EXACT same language and script the user uses in their message. If they write in English, reply in English. If they write in pure Hindi (Devanagari script), reply in pure Hindi. If they write in Hinglish (Hindi words in English alphabet), reply in Hinglish. If the user's language is ambiguous, prefer ${appLanguage}.`;

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
