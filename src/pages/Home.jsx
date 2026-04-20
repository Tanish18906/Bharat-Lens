import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ArrowRight, Wheat, HeartPulse, GraduationCap,
  Briefcase, MessageSquare, List, ShieldCheck, Zap,
  ChevronRight, Shield
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

const CATEGORIES = [
  { labelKey: "catAgriculture", icon: Wheat,          color: "#16A34A", bg: "#F0FDF4", query: "Agriculture" },
  { labelKey: "catHealth",      icon: HeartPulse,      color: "#DC2626", bg: "#FFF5F5", query: "Health"      },
  { labelKey: "catEducation",   icon: GraduationCap,   color: "#2563EB", bg: "#EFF6FF", query: "Education"   },
  { labelKey: "catBusiness",    icon: Briefcase,       color: "#D97706", bg: "#FFFBEB", query: "Business"    },
];

const STATS = [
  { labelKey: "statSchemes",  value: "40+",  icon: "📋" },
  { labelKey: "statCitizens",  value: "1K+",  icon: "👥" },
  { labelKey: "statStates",   value: "2",    icon: "🗺️" },
  { labelKey: "statQueries", value: "500+", icon: "✅" },
];

const QUICK_LINKS = [
  { textKey: "qlKisan", query: "PM Kisan ₹6,000 payment status" },
  { textKey: "qlMahtari", query: "Mahtari Vandan Yojana eligibility" },
  { textKey: "qlAyushman", query: "Ayushman Bharat hospital list" },
  { textKey: "qlMudra", query: "MUDRA loan application steps" },
  { textKey: "qlLpg", query: "Free LPG connection apply" },
];

export default function Home() {
  const { t } = useLanguage();
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
            display: "inline-block", padding: "6px 14px", borderRadius: 99,
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: 13, fontWeight: 700, marginBottom: 20, letterSpacing: "0.5px", color: "white"
          }}>
            🇮🇳 {t('badgeText')}
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800,
            color: "white", lineHeight: 1.1, marginBottom: 20,
            letterSpacing: "-1px"
          }}>
            {t('heroTitle')}
          </h1>
          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.8)",
            lineHeight: 1.6, marginBottom: 36,
          }}>
            {t('heroSubtitle')}
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
                placeholder={t('searchPlaceholder')}
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
                {t('askAi')} <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {QUICK_LINKS.map(q => (
              <button
                key={q.textKey}
                onClick={() => navigate(`/chat?q=${encodeURIComponent(q.query)}`)}
                style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 99, padding: "6px 14px", cursor: "pointer",
                  color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500,
                  transition: "all 0.15s", backdropFilter: "blur(4px)",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "rgba(255,107,0,0.25)"; e.currentTarget.style.color = "white"; }}
                onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              >
                {t(q.textKey)}
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
              key={s.labelKey}
              style={{
                padding: "16px 20px",
                textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--saffron)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500, marginTop: 4 }}>{t(s.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Categories ─────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 20px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", background: "var(--saffron-pale)", color: "var(--saffron)", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
            {t('featuredCategories')}
          </div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800, letterSpacing: "-0.5px" }}>
            {t('exploreSchemes')}
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 15 }}>
            {t('thousandsBenefits')}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
            <button
              key={category.labelKey}
              className="card-hover"
              onClick={() => navigate(`/schemes?category=${category.query}`)}
              style={{
                background: "white", border: "1px solid var(--border)",
                borderRadius: 18, padding: "28px 24px",
                cursor: "pointer", textAlign: "left",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: 16,
                background: category.bg, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <Icon size={26} color={category.color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text-heading)", marginBottom: 6 }}>
                {t(category.labelKey)}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
                {t('findAll')} {t(category.labelKey)} {t('schemes')}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: category.color, fontSize: 13, fontWeight: 600 }}>
                {t('explore')} <ChevronRight size={14} />
              </div>
            </button>
            );
          })}
        </div>
      </section>

      {/* ── Feature Callout ─────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "56px auto 0", padding: "0 20px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20,
        }}>
          <FeatureBox
            icon="🤖"
            title={t('featChatTitle')}
            desc={t('featChatDesc')}
            color="var(--saffron)"
            href="/chat"
            cta={t('btnChatNow')}
          />
          <FeatureBox
            icon="🛡️"
            title={t('featScamTitle')}
            desc={t('featScamDesc')}
            color="var(--india-green)"
            href="/verify"
            cta={t('btnVerifyLink')}
          />
          <FeatureBox
            icon="📚"
            title={t('featDirTitle')}
            desc={t('featDirDesc')}
            color="var(--navy)"
            href="/schemes"
            cta={t('btnBrowseAll')}
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
              {t('trustTitle')}
            </div>
            <p style={{ color: "#166534", fontSize: 13, lineHeight: 1.6 }}>
              {t('trustDesc')}
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
