import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  List,
  ShieldCheck,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../LanguageContext";

const NAV_LINKS = [
  { to: "/",        labelKey: "navHome",       icon: Home        },
  { to: "/chat",    labelKey: "navChat",    icon: MessageSquare },
  { to: "/schemes", labelKey: "navSchemes",    icon: List        },
  { to: "/verify",  labelKey: "navVerify",     icon: ShieldCheck },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* ── Top Tricolor Stripe ── */}
      <div className="tricolor-bar" />

      {/* ── Main Navbar ── */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-xs)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--saffron) 0%, #FF4500 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 2px 8px rgba(255,107,0,0.4)",
              }}
            >
              🔍
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "var(--text-heading)", letterSpacing: "-0.3px" }}>
                {t('navTitle')}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.5px", marginTop: -2 }}>
                {t('navSubtitle')}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(({ to, labelKey, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  background: isActive(to) ? "var(--saffron-pale)" : "transparent",
                  color: isActive(to) ? "var(--saffron)" : "var(--text)",
                  borderBottom: isActive(to) ? "2px solid var(--saffron)" : "2px solid transparent",
                }}
              >
                <Icon size={15} />
                {t(labelKey)}
              </Link>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginLeft: 8,
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: lang === 'hi' ? "var(--saffron-pale)" : "white",
                color: lang === 'hi' ? "var(--saffron)" : "var(--text)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.15s",
              }}
              title="Toggle application language"
            >
              <Globe size={14} />
              {lang === 'en' ? 'EN / हिं' : 'हिं / EN'}
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="mobile-nav"
            onClick={() => setMobileOpen(o => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              color: "var(--text-heading)",
              alignItems: "center",
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div
            className="mobile-nav animate-fade-in"
            style={{
              flexDirection: "column",
              background: "white",
              borderTop: "1px solid var(--border)",
              padding: "12px 20px 16px",
              gap: 4,
            }}
          >
            {NAV_LINKS.map(({ to, labelKey, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: 15,
                  background: isActive(to) ? "var(--saffron-pale)" : "transparent",
                  color: isActive(to) ? "var(--saffron)" : "var(--text-heading)",
                }}
              >
                <Icon size={18} />
                {t(labelKey)}
              </Link>
            ))}
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
              <button onClick={toggleLanguage} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: lang === 'hi' ? "var(--saffron-pale)" : "none", 
                border: "1px solid var(--border)",
                padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                fontWeight: 600, fontSize: 14, 
                color: lang === 'hi' ? "var(--saffron)" : "var(--text)", 
                width: "100%",
              }}>
                <Globe size={15} /> {t('toggleLang')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Bar ── */}
      <nav
        className="mobile-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderTop: "1px solid var(--border)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
          padding: "8px 0 12px",
          zIndex: 100,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {NAV_LINKS.map(({ to, labelKey, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 16px",
              borderRadius: 10,
              textDecoration: "none",
              color: isActive(to) ? "var(--saffron)" : "var(--text-muted)",
              fontSize: 10,
              fontWeight: 600,
              transition: "color 0.15s",
            }}
          >
            <Icon size={20} strokeWidth={isActive(to) ? 2.5 : 1.8} />
            {t(labelKey)}
          </Link>
        ))}
      </nav>
    </>
  );
}
