import { X, ExternalLink, CheckCircle, BookOpen, Phone } from "lucide-react";
import { CATEGORY_ICONS } from "../data/schemes";
import { useLanguage } from "../LanguageContext";

export default function SchemeModal({ scheme, onClose }) {
  const { t } = useLanguage();
  if (!scheme) return null;

  const icon = CATEGORY_ICONS[scheme.category] || "📋";
  const regionColor = scheme.region === "Central"
    ? { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" }
    : { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(10,35,66,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      className="animate-fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 20,
          maxWidth: 640,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-muted) 100%)",
          borderRadius: "20px 20px 0 0",
          padding: "24px 24px 20px",
          position: "sticky", top: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0,
              }}>
                {icon}
              </div>
              <div>
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  {scheme.name}
                </h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                    background: regionColor.bg, color: regionColor.text, border: `1px solid ${regionColor.border}`,
                  }}>
                    {scheme.region === "Central" ? (t('navHome') === 'होम' ? "🇮🇳 केंद्र" : "🇮🇳 Central") : (t('navHome') === 'होम' ? "🏔️ छत्तीसगढ़" : "🏔️ Chhattisgarh")}
                  </span>
                  <span style={{
                    padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                    background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)",
                  }}>
                    {scheme.category}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer",
              borderRadius: 8, padding: 8, color: "white", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {/* Description */}
          <p style={{ color: "var(--text)", lineHeight: 1.7, marginBottom: 24, fontSize: 14 }}>
            {scheme.description}
          </p>

          <Section icon="✅" title={t('modElig')}>
            <p style={{ color: "var(--text)", lineHeight: 1.7, fontSize: 14 }}>{scheme.eligibility}</p>
          </Section>

          <Section icon="🎁" title={t('modBen')}>
            <p style={{ color: "var(--text)", lineHeight: 1.7, fontSize: 14, fontWeight: 500 }}>{scheme.benefit}</p>
          </Section>

          <Section icon={<BookOpen size={15} />} title={t('modAppProc')}>
            <p style={{ color: "var(--text)", lineHeight: 1.8, fontSize: 14 }}>{scheme.applicationProcess}</p>
          </Section>

          <Section icon="📄" title={t('modDocsReq')}>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {scheme.documents.map((doc, i) => (
                <li key={i} style={{ color: "var(--text)", fontSize: 14, lineHeight: 2, display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={13} color="var(--india-green)" style={{ flexShrink: 0 }} />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Helpdesk */}
          <div style={{
            background: "var(--saffron-pale)", borderRadius: 12, padding: "14px 16px",
            display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20,
            border: "1px solid rgba(255,107,0,0.15)",
          }}>
            <Phone size={16} color="var(--saffron)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--saffron)", letterSpacing: "0.5px", marginBottom: 2 }}>
                {t('modHelpdeskTitle')}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-heading)", fontWeight: 500 }}>
                {scheme.helpdesk}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
            {scheme.tags.map(tag => (
              <span key={tag} style={{
                padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                background: "var(--border-subtle)", color: "var(--text-muted)",
              }}>#{tag}</span>
            ))}
          </div>

          {/* Official Link */}
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "14px 20px", borderRadius: 12,
              background: "linear-gradient(135deg, var(--saffron) 0%, #FF4500 100%)",
              color: "white", fontWeight: 700, fontSize: 15, textDecoration: "none",
              boxShadow: "0 4px 15px rgba(255,107,0,0.35)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,107,0,0.45)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(255,107,0,0.35)"; }}
          >
            {t('modApplyNow')}
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-heading)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
          {title}
        </h3>
      </div>
      <div style={{
        background: "var(--bg)", borderRadius: 10, padding: "12px 14px",
        border: "1px solid var(--border-subtle)",
      }}>
        {children}
      </div>
    </div>
  );
}
