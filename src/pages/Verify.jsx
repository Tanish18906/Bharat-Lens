import { useState } from "react";
import {
  ShieldCheck, AlertTriangle, Link2, MessageSquare,
  ExternalLink, Info, Copy, CheckCheck, Phone,
} from "lucide-react";
import { verifyLink } from "../services/api";

const EXAMPLE_INPUTS = [
  { label: "Official PM-KISAN Site",    value: "https://pmkisan.gov.in",                                    type: "URL" },
  { label: "Suspicious Scheme SMS",    value: "Congratulations! Claim your ₹10,000 PM relief fund: bit.ly/pm-relief-2024", type: "SMS" },
  { label: "Fake Aadhaar KYC",         value: "Urgent: Your Aadhaar is suspended. Verify KYC now: tinyurl.com/aadhar-kyc", type: "SMS" },
  { label: "Ayushman Bharat Portal",   value: "https://pmjay.gov.in",                                       type: "URL" },
];

const VERDICT_CONFIG = {
  green:  { icon: "✅", headerBg: "#F0FDF4", headerBorder: "#86EFAC", textColor: "#166534", badgeBg: "#DCFCE7", barColor: "#22C55E" },
  red:    { icon: "🚨", headerBg: "#FFF5F5", headerBorder: "#FCA5A5", textColor: "#991B1B", badgeBg: "#FEE2E2", barColor: "#EF4444" },
  orange: { icon: "⚠️", headerBg: "#FFFBEB", headerBorder: "#FCD34D", textColor: "#92400E", badgeBg: "#FEF3C7", barColor: "#F59E0B" },
  yellow: { icon: "🔍", headerBg: "#F0F9FF", headerBorder: "#BAE6FD", textColor: "#075985", badgeBg: "#E0F2FE", barColor: "#0EA5E9" },
};

const SCAM_TIPS = [
  { icon: "🔒", tip: "Real government sites always end in .gov.in or .nic.in" },
  { icon: "📵", tip: "Government never asks for OTP or bank PIN via SMS/WhatsApp" },
  { icon: "🚫", tip: "Shortened URLs (bit.ly, tinyurl) are major red flags" },
  { icon: "📞", tip: "If in doubt, call the official helpline — never click the link" },
  { icon: "💸", tip: "No government scheme asks for payment to 'release' your benefit" },
];

export default function Verify() {
  const [input,   setInput]   = useState("");
  const [result,  setResult]  = useState(null);
  const [copied,  setCopied]  = useState(false);
  const [checked, setChecked] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = verifyLink(input.trim());
    setResult(res);
    setChecked(true);
  };

  const handleExample = (val) => {
    setInput(val);
    setResult(null);
    setChecked(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cfg = result ? VERDICT_CONFIG[result.color] : null;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 100px" }}>
      {/* ── Page Header ── */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: "0 auto 16px",
          background: "linear-gradient(135deg, var(--india-green), #0F7A07)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 30px rgba(19,136,8,0.3)",
        }}>
          <ShieldCheck size={30} color="white" />
        </div>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>
          Scam & Link Checker
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
          Paste any suspicious link or SMS message. We'll instantly check if it's a
          verified government source or a known scam pattern.
        </p>
      </div>

      {/* ── Input Form ── */}
      <div style={{
        background: "white", borderRadius: 20, padding: "24px",
        border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
        marginBottom: 24,
      }}>
        {/* Type selector chips */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[{ icon: Link2, label: "URL / Link" }, { icon: MessageSquare, label: "SMS / WhatsApp" }].map(({ icon: Icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 99,
              background: "var(--border-subtle)", fontSize: 12, fontWeight: 600,
              color: "var(--text-muted)",
            }}>
              <Icon size={13} /> {label}
            </div>
          ))}
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ position: "relative" }}>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setResult(null); setChecked(false); }}
              placeholder="Paste URL or SMS text here...&#10;e.g. https://pm-relief-fund.in/claim or &#10;&quot;Congratulations! Claim ₹10,000 at...&quot;"
              rows={4}
              style={{
                width: "100%", border: "2px solid var(--border)", borderRadius: 14,
                padding: "14px 44px 14px 14px", fontSize: 14, fontFamily: "inherit",
                color: "var(--text-heading)", outline: "none", resize: "vertical",
                lineHeight: 1.6, transition: "border-color 0.15s, box-shadow 0.15s",
                minHeight: 100,
              }}
              onFocus={e => { e.target.style.borderColor = "var(--india-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(19,136,8,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
            />
            {input && (
              <button type="button" onClick={handleCopy} style={{
                position: "absolute", top: 10, right: 10,
                background: "var(--border-subtle)", border: "none", borderRadius: 6,
                padding: "4px 6px", cursor: "pointer", color: "var(--text-muted)",
                display: "flex", alignItems: "center",
              }}>
                {copied ? <CheckCheck size={13} color="var(--india-green)" /> : <Copy size={13} />}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            style={{
              width: "100%", marginTop: 14, padding: "14px",
              borderRadius: 12, border: "none", cursor: !input.trim() ? "not-allowed" : "pointer",
              background: !input.trim()
                ? "var(--border)"
                : "linear-gradient(135deg, var(--india-green), #0F7A07)",
              color: "white", fontWeight: 700, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: !input.trim() ? "none" : "0 4px 14px rgba(19,136,8,0.35)",
              transition: "all 0.2s",
            }}
          >
            <ShieldCheck size={18} />
            Check Now
          </button>
        </form>

        {/* Examples */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: 8 }}>
            TRY AN EXAMPLE
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EXAMPLE_INPUTS.map(ex => (
              <button
                key={ex.label}
                onClick={() => handleExample(ex.value)}
                style={{
                  background: "none", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600,
                  color: "var(--text)",
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "all 0.15s",
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "var(--india-green)"; e.currentTarget.style.color = "var(--india-green)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
              >
                <span style={{
                  padding: "1px 5px", borderRadius: 4, fontSize: 9, fontWeight: 700,
                  background: ex.type === "URL" ? "#EFF6FF" : "#FFF3E8",
                  color: ex.type === "URL" ? "#1D4ED8" : "var(--saffron)",
                }}>
                  {ex.type}
                </span>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Result Card ── */}
      {checked && result && cfg && (
        <div
          className="animate-fade-up"
          style={{
            background: "white", borderRadius: 20, overflow: "hidden",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
            marginBottom: 24,
          }}
        >
          {/* Result header */}
          <div style={{
            background: cfg.headerBg, borderBottom: `1px solid ${cfg.headerBorder}`,
            padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: cfg.badgeBg,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              flexShrink: 0, border: `1px solid ${cfg.headerBorder}`,
            }}>
              {cfg.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: cfg.textColor, marginBottom: 4 }}>
                {result.verdict}
              </div>
              <div style={{ fontSize: 13, color: cfg.textColor, opacity: 0.8 }}>
                {result.isGovDomain ? "✓ Verified .gov.in domain" : "Not a .gov.in domain"}
                {result.isUrl && ` · Link detected`}
              </div>
            </div>
            {/* Risk Score Gauge */}
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: cfg.textColor, lineHeight: 1 }}>
                {result.riskScore}
              </div>
              <div style={{ fontSize: 10, color: cfg.textColor, opacity: 0.7, fontWeight: 600 }}>
                RISK SCORE
              </div>
            </div>
          </div>

          {/* Risk bar */}
          <div style={{ height: 6, background: "var(--border-subtle)" }}>
            <div style={{
              height: "100%", background: cfg.barColor,
              width: `${result.riskScore}%`,
              transition: "width 1s ease",
            }} />
          </div>

          <div style={{ padding: "20px 24px" }}>
            {/* Detail */}
            <div style={{
              background: cfg.headerBg, borderRadius: 10, padding: "12px 14px",
              marginBottom: 16, border: `1px solid ${cfg.headerBorder}`,
            }}>
              <p style={{ color: cfg.textColor, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {result.detail}
              </p>
            </div>

            {/* Advice */}
            <div style={{
              background: "var(--bg)", borderRadius: 10, padding: "12px 14px",
              marginBottom: 16, border: "1px solid var(--border)",
              display: "flex", gap: 10,
            }}>
              <Info size={15} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                {result.advice}
              </p>
            </div>

            {/* Flags */}
            {result.flags.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: 8 }}>
                  DETECTED ISSUES
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {result.flags.map((f, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 8, alignItems: "flex-start",
                      background: "#FFF5F5", borderRadius: 8, padding: "8px 12px",
                      border: "1px solid #FED7D7", fontSize: 12, color: "#C53030",
                    }}>
                      <AlertTriangle size={13} style={{ marginTop: 2, flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report Cybercrime */}
            {(result.color === "red" || result.color === "orange") && (
              <div style={{
                background: "#FFF5F5", borderRadius: 12, padding: "14px 16px",
                display: "flex", gap: 10, alignItems: "flex-start",
                border: "1px solid #FED7D7",
              }}>
                <Phone size={16} color="#DC2626" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#DC2626", marginBottom: 4 }}>
                    Report This Scam
                  </div>
                  <div style={{ fontSize: 12, color: "#7B341E", lineHeight: 1.5 }}>
                    Call Cyber Crime Helpline <strong>1930</strong> or visit{" "}
                    <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
                      style={{ color: "#DC2626", fontWeight: 600 }}>
                      cybercrime.gov.in <ExternalLink size={10} style={{ verticalAlign: "middle" }} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Safety Tips ── */}
      <div style={{
        background: "white", borderRadius: 20, padding: "24px",
        border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)",
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} color="var(--india-green)" />
          How to Stay Safe Online
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SCAM_TIPS.map(({ icon, tip }, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              padding: "10px 12px", borderRadius: 10, background: "var(--bg)",
              border: "1px solid var(--border-subtle)",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
          Cyber Crime Helpline: <strong>1930</strong> · Report at{" "}
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--india-green)", fontWeight: 600, textDecoration: "none" }}>
            cybercrime.gov.in
          </a>
        </div>
      </div>
    </div>
  );
}
