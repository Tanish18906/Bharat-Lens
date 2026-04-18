import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ArrowRight, Wheat, HeartPulse, GraduationCap,
  Briefcase, ChevronRight, Shield, Zap, Users
} from "lucide-react";

const CATEGORIES = [
  { label: "Agriculture", icon: Wheat,          color: "#16A34A", bg: "#F0FDF4", query: "Agriculture" },
  { label: "Health",      icon: HeartPulse,      color: "#DC2626", bg: "#FFF5F5", query: "Health"      },
  { label: "Education",   icon: GraduationCap,   color: "#2563EB", bg: "#EFF6FF", query: "Education"   },
  { label: "Business",    icon: Briefcase,       color: "#D97706", bg: "#FFFBEB", query: "Business"    },
];

const STATS = [
  { label: "Schemes Indexed",  value: "40+",  icon: "📋" },
  { label: "Citizens Helped",  value: "1K+",  icon: "👥" },
  { label: "States Covered",   value: "2",    icon: "🗺️" },
  { label: "Queries Resolved", value: "500+", icon: "✅" },
];

const QUICK_LINKS = [
  "PM Kisan ₹6,000 payment status",
  "Mahtari Vandan Yojana eligibility",
  "Ayushman Bharat hospital list",
  "MUDRA loan application steps",
  "Free LPG connection apply",
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/chat?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div style={{ flex: 1, paddingBottom: 80 }}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero-gradient" style={{ padding: "60px 20px 80px", textAlign: "center", position: "relative" }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: 20, left: "5%",
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        }} />
        <div style={{
          position: "absolute", bottom: 30, right: "8%",
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)",
        }} />

        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 99, padding: "6px 16px", marginBottom: 28,
          }}>
            <Zap size={13} color="#FFB347" fill="#FFB347" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              Powered by AI · RAG-enabled · 40 Schemes
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            marginBottom: 16,
            letterSpacing: "-1px",
          }}>
            Your Gateway to{" "}
            <span style={{
              background: "linear-gradient(90deg, var(--saffron), #FFB347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Government Benefits
            </span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.72)", fontSize: "clamp(14px, 2vw, 17px)",
            lineHeight: 1.7, marginBottom: 36,
          }}>
            Ask in plain language. Get instant answers about Central & Chhattisgarh
            schemes — eligibility, benefits, and step-by-step application guidance.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ position: "relative", maxWidth: 580, margin: "0 auto 28px" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "white",
              borderRadius: 14,
              boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
              overflow: "hidden",
              border: "2px solid rgba(255,107,0,0.2)",
            }}>
              <Search size={18} color="var(--text-muted)" style={{ marginLeft: 16, flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g., मैं PM Kisan के लिए eligible हूँ?"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  padding: "16px 12px", fontSize: 14, color: "var(--text-heading)",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, var(--saffron) 0%, #FF4500 100%)",
                  border: "none", cursor: "pointer",
                  padding: "12px 20px", margin: 5, borderRadius: 10,
                  display: "flex", alignItems: "center", gap: 6,
                  color: "white", fontWeight: 700, fontSize: 14,
                  transition: "opacity 0.15s",
                }}
              >
                Ask AI <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {QUICK_LINKS.map(q => (
              <button
                key={q}
                onClick={() => navigate(`/chat?q=${encodeURIComponent(q)}`)}
                style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 99, padding: "6px 14px", cursor: "pointer",
                  color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500,
                  transition: "all 0.15s", backdropFilter: "blur(4px)",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "rgba(255,107,0,0.25)"; e.currentTarget.style.color = "white"; }}
                onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              >
                {q}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── Stats Band ────────────────────────────────────────────── */}
      <div style={{ background: "var(--navy)", padding: "20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 0 }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "16px 20px",
                textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--saffron)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Categories ─────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 20px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", background: "var(--saffron-pale)", color: "var(--saffron)", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
            FEATURED CATEGORIES
          </div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Explore Schemes by Category
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 15 }}>
            Thousands of crores in annual benefits waiting to be claimed
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {CATEGORIES.map(({ label, icon: Icon, color, bg, query: q }) => (
            <button
              key={label}
              className="card-hover"
              onClick={() => navigate(`/schemes?category=${q}`)}
              style={{
                background: "white", border: "1px solid var(--border)",
                borderRadius: 18, padding: "28px 24px",
                cursor: "pointer", textAlign: "left",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: 16,
                background: bg, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <Icon size={26} color={color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text-heading)", marginBottom: 6 }}>
                {label}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
                Find all {label.toLowerCase()} schemes
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color, fontSize: 13, fontWeight: 600 }}>
                Explore <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Feature Callout ─────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "56px auto 0", padding: "0 20px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20,
        }}>
          <FeatureBox
            icon="🤖"
            title="AI-Powered Answers"
            desc="Ask in Hindi or English. Our AI searches 40+ schemes instantly and gives you personalized eligibility checks."
            color="var(--saffron)"
            href="/chat"
            cta="Chat Now"
          />
          <FeatureBox
            icon="🛡️"
            title="Scam Verification"
            desc="Paste any link or SMS message. We'll tell you instantly if it's a scam or a real government portal."
            color="var(--india-green)"
            href="/verify"
            cta="Verify Link"
          />
          <FeatureBox
            icon="📚"
            title="Scheme Directory"
            desc="Browse all 40 Central & CG schemes with full eligibility, documents needed, and official portal links."
            color="var(--navy)"
            href="/schemes"
            cta="Browse All"
          />
        </div>
      </section>

      {/* ── Trust Bar ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: "56px auto 0", padding: "0 20px" }}>
        <div style={{
          background: "linear-gradient(135deg, #F0FDF4, #E6F4E6)",
          borderRadius: 18, padding: "24px 28px",
          border: "1px solid #BBF7D0",
          display: "flex", alignItems: "flex-start", gap: 16,
        }}>
          <Shield size={28} color="var(--india-green)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--india-green)", marginBottom: 4 }}>
              100% Free · No Data Stored · Official Sources Only
            </div>
            <p style={{ color: "#166534", fontSize: 13, lineHeight: 1.6 }}>
              Bharat Lens is a public-interest tool. All scheme information is sourced directly from
              official Government of India and Chhattisgarh state portals. We never ask for Aadhaar or personal data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureBox({ icon, title, desc, color, href, cta }) {
  const navigate = useNavigate();
  return (
    <div className="card-hover" style={{
      background: "white", border: "1px solid var(--border)",
      borderRadius: 18, padding: "24px",
      boxShadow: "var(--shadow-sm)", cursor: "pointer",
    }} onClick={() => navigate(href)}>
      <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text-heading)", marginBottom: 8 }}>{title}</div>
      <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{desc}</p>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color, fontWeight: 700, fontSize: 13,
      }}>
        {cta} <ArrowRight size={14} />
      </span>
    </div>
  );
}
