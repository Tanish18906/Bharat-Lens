import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Send, Mic, MicOff, Bot, User, ExternalLink,
  Sparkles, RotateCcw, Copy, CheckCheck,
} from "lucide-react";
import { searchSchemes } from "../services/api";
import { ChatShimmer, ThinkingDots } from "../components/ShimmerLoader";
import { useLanguage } from "../LanguageContext";

const SUGGESTED_QUESTIONS = [
  { textKey: "sqMahtari", query: "How do I apply for Mahtari Vandan Yojana?", emoji: "👩" },
  { textKey: "sqKisan", query: "PM Kisan ₹6,000 — am I eligible?", emoji: "🌾" },
  { textKey: "sqAyushman", query: "What documents do I need for Ayushman Bharat?", emoji: "🏥" },
  { textKey: "sqMudra", query: "How to get MUDRA loan for small business?", emoji: "💼" },
  { textKey: "sqPadhai", query: "Padhai Tuhar Dwar — how to access online classes?", emoji: "📚" },
  { textKey: "sqGodhan", query: "What is the Godhan Nyay Yojana benefit?", emoji: "🐄" },
];

function MessageBubble({ msg, onCopy }) {
  const { t } = useLanguage();
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onCopy) onCopy();
  };

  return (
    <div
      className="animate-fade-up"
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 10,
        alignItems: "flex-end",
        maxWidth: "100%",
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: isUser
          ? "linear-gradient(135deg, var(--saffron), #FF4500)"
          : "linear-gradient(135deg, var(--navy), var(--navy-muted))",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "var(--shadow-xs)",
      }}>
        {isUser ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
      </div>

      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 6, alignItems: isUser ? "flex-end" : "flex-start" }}>
        {/* Bubble */}
        <div
          className={isUser ? "bubble-user" : "bubble-assistant"}
          style={{
            position: "relative",
            padding: "12px 16px",
            borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            background: isUser
              ? "linear-gradient(135deg, var(--saffron) 0%, #FF4500 100%)"
              : "white",
            color: isUser ? "white" : "var(--text-heading)",
            fontSize: 14,
            lineHeight: 1.7,
            boxShadow: isUser ? "0 4px 15px rgba(255,107,0,0.3)" : "var(--shadow-sm)",
            border: isUser ? "none" : "1px solid var(--border)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <ReactMarkdown className="prose">{msg.content}</ReactMarkdown>
        </div>

        {/* Source labels */}
        {msg.sources && msg.sources.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {msg.sources.map((src, i) => (
              <div key={i} className="source-tag">
                📋 {src.name}
                {src.url && (
                  <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", display: "flex" }}>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Copy + Timestamp row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
            {msg.time}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", padding: 2, borderRadius: 4,
                display: "flex", alignItems: "center", gap: 3, fontSize: 11,
              }}
            >
              {copied ? <CheckCheck size={12} color="var(--india-green)" /> : <Copy size={12} />}
              {copied ? t('chatCopied') : t('chatCopy')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ error, onRetry }) {
  const { t } = useLanguage();
  return (
    <div style={{
      background: "#FFF5F5", border: "1px solid #FED7D7",
      borderRadius: 12, padding: "14px 16px",
      display: "flex", alignItems: "flex-start", gap: 10,
    }}>
      <span style={{ fontSize: 18 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#C53030", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
          {t('chatErrorTitle')}
        </div>
        <div style={{ color: "#744210", fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>
          {error}
        </div>
        <button onClick={onRetry} style={{
          background: "none", border: "1px solid #FC8181",
          borderRadius: 6, padding: "4px 10px", cursor: "pointer",
          color: "#C53030", fontSize: 12, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <RotateCcw size={12} /> {t('chatRetry')}
        </button>
      </div>
    </div>
  );
}

export default function Chat() {
  const { lang, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialQuery   = searchParams.get("q") || "";

  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState(initialQuery);
  const [loading,      setLoading]      = useState(false);
  const [listening,    setListening]    = useState(false);
  const [error,        setError]        = useState(null);
  const [lastQuery,    setLastQuery]    = useState("");

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-send if query from URL
  useEffect(() => {
    if (initialQuery) {
      sendMessage(null, initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const now = () =>
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async (e, overrideText) => {
    if (e) e.preventDefault();
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    setLastQuery(text);

    const userMsg = { role: "user", content: text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Pass the last 10 messages as history context for the AI
      const historyContext = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const { answer, sources } = await searchSchemes(text, historyContext, lang);
      const assistantMsg = {
        role: "assistant",
        content: answer,
        sources,
        time: now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setError(err.message || t('chatErrorMsg'));
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (q) => {
    setInput(q);
    sendMessage(null, q);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  // Voice input (Web Speech API)
  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert(t('chatVoiceNotSupported'));
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend   = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="chat-container">
      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 0 12px", borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, var(--navy), var(--navy-muted))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={18} color="var(--saffron)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-heading)" }}>{t('chatAiTitle')}</div>
            <div style={{ fontSize: 11, color: "var(--india-green)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--india-green)", display: "inline-block" }} />
              {t('chatAiStatus')}
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} style={{
            background: "none", border: "1px solid var(--border)",
            borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            color: "var(--text-muted)", fontSize: 12, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <RotateCcw size={13} /> {t('chatNew')}
          </button>
        )}
      </div>

      {/* ── Messages Area ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0", display: "flex", flexDirection: "column", gap: 20 }}>
        {isEmpty && (
          <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "20px 0" }}>
            {/* Empty state */}
            <div style={{
              width: 72, height: 72, borderRadius: 20, marginBottom: 20,
              background: "linear-gradient(135deg, var(--navy), var(--navy-muted))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 30px rgba(10,35,66,0.25)",
            }}>
              <Sparkles size={32} color="var(--saffron)" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text-heading)" }}>
              {t('chatEmptyTitle')}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, textAlign: "center", maxWidth: 400, marginBottom: 32 }}>
              {t('chatEmptySubtitle')}
            </p>

            {/* Suggested Questions Carousel */}
            <div style={{ width: "100%", maxWidth: 800 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: 10, textAlign: "left" }}>
                {t('chatSuggested').toUpperCase()}
              </div>
              <div className="carousel-scroll">
                {SUGGESTED_QUESTIONS.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(sq.query)}
                    style={{
                      flexShrink: 0,
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "10px 14px",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 13,
                      color: "var(--text-heading)",
                      fontWeight: 500,
                      boxShadow: "var(--shadow-xs)",
                      transition: "all 0.15s",
                      maxWidth: 220,
                      whiteSpace: "normal",
                      lineHeight: 1.4,
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "var(--saffron)"; e.currentTarget.style.boxShadow = "0 0 0 2px var(--saffron-pale)"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; }}
                  >
                    <span style={{ marginRight: 6 }}>{sq.emoji}</span>
                    {t(sq.textKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg, var(--navy), var(--navy-muted))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{
              background: "white", borderRadius: "4px 18px 18px 18px",
              padding: "14px 18px", border: "1px solid var(--border)",
              boxShadow: "var(--shadow-xs)",
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>
                🔍 {t('chatVoiceListen')}
              </div>
              <ThinkingDots />
              <ChatShimmer />
            </div>
          </div>
        )}

        {error && <ErrorMessage error={error} onRetry={() => sendMessage(null, lastQuery)} />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div style={{ paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
        <form onSubmit={sendMessage} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          {/* Voice Button */}
          <button
            type="button"
            onClick={toggleVoice}
            style={{
              position: "relative",
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: listening
                ? "linear-gradient(135deg, var(--saffron), #FF4500)"
                : "white",
              border: "1px solid var(--border)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: listening ? "0 4px 15px rgba(255,107,0,0.4)" : "var(--shadow-xs)",
              transition: "all 0.2s",
            }}
            title="Voice input (Hindi/English)"
          >
            {listening && <div className="pulse-ring" style={{ position: "absolute", inset: 0, borderRadius: 12 }} />}
            {listening
              ? <MicOff size={18} color="white" />
              : <Mic size={18} color="var(--text-muted)" />
            }
          </button>

          {/* Text input */}
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value.slice(0, 1000))}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(e); }
              }}
              placeholder={t('chatInputPlaceholder')}
              rows={1}
              style={{
                width: "100%",
                border: "1px solid var(--border)",
                borderRadius: 12, padding: "12px 14px",
                fontSize: 14, fontFamily: "inherit",
                color: "var(--text-heading)",
                outline: "none", resize: "none",
                boxShadow: "var(--shadow-xs)",
                transition: "border-color 0.15s, box-shadow 0.15s",
                lineHeight: 1.5,
                maxHeight: 120,
                overflowY: "auto",
              }}
              onFocus={e => { e.target.style.borderColor = "var(--saffron)"; e.target.style.boxShadow = "0 0 0 3px var(--saffron-pale)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "var(--shadow-xs)"; }}
            />
            <div style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, color: "var(--text-muted)" }}>
              {input.length}/1000
            </div>
          </div>

          {/* Send */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: !input.trim() || loading
                ? "var(--border)"
                : "linear-gradient(135deg, var(--saffron) 0%, #FF4500 100%)",
              border: "none", cursor: !input.trim() || loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: !input.trim() || loading ? "none" : "0 4px 12px rgba(255,107,0,0.4)",
              transition: "all 0.2s",
            }}
          >
            <Send size={17} color="white" />
          </button>
        </form>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 8 }}>
          {t('chatFooterText1')}<kbd style={{ padding: "2px 5px", borderRadius: 4, border: "1px solid var(--border)", fontSize: 10 }}>{t('chatFooterText2')}</kbd>{t('chatFooterText3')}
        </div>
      </div>
    </div>
  );
}
