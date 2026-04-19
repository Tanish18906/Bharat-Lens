import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { SCHEMES, CATEGORIES, REGIONS, CATEGORY_ICONS } from "../data/schemes";
import { SCHEMES_HI } from "../data/schemes_hi";
import { useLanguage } from "../LanguageContext";
import SchemeModal from "../components/SchemeModal";

function SchemeCard({ scheme, onLearnMore, t, lang }) {
  const icon   = CATEGORY_ICONS[scheme.category] || "📋";
  const isCG   = scheme.region === "Chhattisgarh" || scheme.region === "छत्तीसगढ़";
  const regionStyle = isCG
    ? { bg: "#F0FDF4", text: "#166534", border: "#D1FAE5", label: lang === 'hi' ? "🏔️ छत्तीसगढ़" : "🏔️ Chhattisgarh" }
    : { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", label: lang === 'hi' ? "🇮🇳 केंद्र" : "🇮🇳 Central" };

  return (
    <div
      className="card-hover"
      style={{
        background: "white", borderRadius: 16, overflow: "hidden",
        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: isCG ? "var(--india-green)" : "var(--saffron)" }} />

      <div style={{ padding: "18px 18px 16px", flex: 1 }}>
        {/* Icon + Badges row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 13, fontSize: 22,
            background: "var(--bg)", border: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {icon}
          </div>
          <span style={{
            padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700,
            background: regionStyle.bg, color: regionStyle.text, border: `1px solid ${regionStyle.border}`,
            letterSpacing: "0.2px",
          }}>
            {regionStyle.label}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.4, marginBottom: 6 }}>
          {scheme.name}
        </h3>

        {/* Category badge */}
        <div style={{
          display: "inline-block", padding: "2px 8px", borderRadius: 6,
          background: "var(--border-subtle)", color: "var(--text-muted)",
          fontSize: 11, fontWeight: 600, marginBottom: 10,
        }}>
          {scheme.category}
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, marginBottom: 0,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {scheme.description}
        </p>
      </div>

      {/* Card footer */}
      <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg)" }}>
        <button
          onClick={() => onLearnMore(scheme)}
          style={{
            width: "100%", padding: "10px 16px", borderRadius: 10,
            background: "linear-gradient(135deg, var(--saffron) 0%, #FF4500 100%)",
            border: "none", cursor: "pointer",
            color: "white", fontWeight: 700, fontSize: 13,
            boxShadow: "0 3px 10px rgba(255,107,0,0.3)",
            transition: "opacity 0.15s",
          }}
          onMouseOver={e => e.currentTarget.style.opacity = "0.9"}
          onMouseOut={e => e.currentTarget.style.opacity = "1"}
        >
          {t('schViewDetails')} →
        </button>
      </div>
    </div>
  );
}

export default function Schemes() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initCategory = searchParams.get("category") || "";

  const [search,           setSearch]     = useState("");
  const [selectedCats,     setSelectedCats] = useState(initCategory ? [initCategory] : []);
  const [selectedRegions,  setSelectedRegions] = useState([]);
  const [modalScheme,      setModalScheme] = useState(null);
  const [sidebarOpen,      setSidebarOpen] = useState(false);

  const ACTIVE_SCHEMES = lang === 'hi' ? SCHEMES_HI : SCHEMES;

  const filtered = useMemo(() => {
    return ACTIVE_SCHEMES.filter(s => {
      const matchSearch = !search || [s.name, s.description, s.category, s.region]
        .join(" ").toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCats.length === 0 || selectedCats.some(c => {
        const catKey = 'cat' + c.replace(/[^a-zA-Z]/g, '');
        const translatedCat = t(catKey) !== catKey ? t(catKey) : c;
        return s.category === c || s.category === translatedCat || s.category.includes(c) || s.category.includes(translatedCat);
      });
      const matchRegion = selectedRegions.length === 0 || selectedRegions.includes(s.region) || (s.region === 'केंद्र' && selectedRegions.includes('Central')) || (s.region === 'छत्तीसगढ़' && selectedRegions.includes('Chhattisgarh'));
      return matchSearch && matchCat && matchRegion;
    });
  }, [search, selectedCats, selectedRegions, ACTIVE_SCHEMES]);

  const toggleFilter = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const clearAll = () => {
    setSearch(""); setSelectedCats([]); setSelectedRegions([]);
    setSearchParams({});
  };

  const activeFilterCount = selectedCats.length + selectedRegions.length + (search ? 1 : 0);

  return (
    <>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 100px", display: "flex", gap: 24 }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 240, flexShrink: 0,
          display: "none", // hidden on mobile by default; shown via media doesn't work with inline
        }} className="desktop-nav" >
          <SidebarContent
            selectedCats={selectedCats}
            selectedRegions={selectedRegions}
            toggleFilter={toggleFilter}
            setSelectedCats={setSelectedCats}
            setSelectedRegions={setSelectedRegions}
            activeFilterCount={activeFilterCount}
            clearAll={clearAll}
            t={t}
            lang={lang}
          />
        </aside>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top bar */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("schSearchPlace")}
                style={{
                  width: "100%", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "10px 12px 10px 36px",
                  fontSize: 14, outline: "none", background: "white",
                  fontFamily: "inherit", color: "var(--text-heading)",
                }}
                onFocus={e => { e.target.style.borderColor = "var(--saffron)"; e.target.style.boxShadow = "0 0 0 3px var(--saffron-pale)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              className="mobile-nav"
              onClick={() => setSidebarOpen(o => !o)}
              style={{
                display: "flex",
                background: activeFilterCount > 0 ? "var(--saffron)" : "white",
                border: "1px solid var(--border)", borderRadius: 10,
                padding: "10px 14px", cursor: "pointer",
                color: activeFilterCount > 0 ? "white" : "var(--text)",
                fontWeight: 600, fontSize: 13,
                alignItems: "center", gap: 6, flexShrink: 0,
              }}
            >
              <SlidersHorizontal size={15} />
              {t('schFilters')}
              {activeFilterCount > 0 && (
                <span style={{
                  background: "white", color: "var(--saffron)",
                  borderRadius: 99, width: 18, height: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800,
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>
              {filtered.length} / {ACTIVE_SCHEMES.length}
            </div>
          </div>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <div className="animate-fade-in" style={{ marginBottom: 16 }}>
              <SidebarContent
                selectedCats={selectedCats}
                selectedRegions={selectedRegions}
                toggleFilter={toggleFilter}
                setSelectedCats={setSelectedCats}
                setSelectedRegions={setSelectedRegions}
                activeFilterCount={activeFilterCount}
                clearAll={clearAll}
                t={t}
                lang={lang}
              />
            </div>
          )}

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {selectedCats.map(c => {
                const catKey = 'cat' + c.replace(/[^a-zA-Z]/g, '');
                const catLabel = t(catKey) !== catKey ? t(catKey) : c;
                return <Chip key={c} label={catLabel} onRemove={() => toggleFilter(selectedCats, setSelectedCats, c)} />
              })}
              {selectedRegions.map(r => {
                const rLabel = r === "Central" ? (lang === 'hi' ? "🇮🇳 केंद्र" : "🇮🇳 Central") : (lang === 'hi' ? "🏔️ छत्तीसगढ़" : "🏔️ Chhattisgarh");
                return <Chip key={r} label={rLabel} onRemove={() => toggleFilter(selectedRegions, setSelectedRegions, r)} />
              })}
              {search && <Chip label={`"${search}"`} onRemove={() => setSearch("")} />}
              <button onClick={clearAll} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 3, padding: "4px 8px",
              }}>
                <X size={12} /> {t('schClearAll')}
              </button>
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ color: "var(--text-heading)", marginBottom: 8 }}>{t('schNoSchemesFound')}</h3>
              <p>{t('schTryDifferent')}</p>
              <button onClick={clearAll} style={{
                marginTop: 16, padding: "10px 20px", borderRadius: 10,
                background: "var(--saffron)", color: "white", border: "none",
                cursor: "pointer", fontWeight: 600, fontSize: 14,
              }}>{t('schBtnClear')}</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
              {filtered.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} onLearnMore={setModalScheme} t={t} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalScheme && (
        <SchemeModal scheme={modalScheme} onClose={() => setModalScheme(null)} />
      )}
    </>
  );
}

function SidebarContent({ selectedCats, selectedRegions, toggleFilter, setSelectedCats, setSelectedRegions, activeFilterCount, clearAll, t, lang }) {
  const [catsOpen, setCatsOpen] = useState(true);
  const [regOpen,  setRegOpen]  = useState(true);

  return (
    <div style={{
      background: "white", borderRadius: 16, border: "1px solid var(--border)",
      overflow: "hidden", boxShadow: "var(--shadow-xs)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal size={15} /> {t('schFilters')}
          {activeFilterCount > 0 && (
            <span style={{
              background: "var(--saffron)", color: "white",
              borderRadius: 99, padding: "0px 7px", fontSize: 11, fontWeight: 700,
            }}>{activeFilterCount}</span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--saffron)", fontSize: 12, fontWeight: 600,
          }}>{t('schClearBtn')}</button>
        )}
      </div>

      {/* Region */}
      <FilterSection title={t('schRegion')} open={regOpen} toggle={() => setRegOpen(o => !o)}>
        {REGIONS.map(r => (
          <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "5px 0" }}>
            <input type="checkbox" className="bl-check" checked={selectedRegions.includes(r)}
              onChange={() => toggleFilter(selectedRegions, setSelectedRegions, r)} />
            <span style={{ fontSize: 13, color: "var(--text)", fontWeight: selectedRegions.includes(r) ? 600 : 400 }}>
              {r === "Central" ? (lang === 'hi' ? "🇮🇳 केंद्र" : "🇮🇳 Central") : (lang === 'hi' ? "🏔️ छत्तीसगढ़" : "🏔️ Chhattisgarh")}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Category */}
      <FilterSection title={t('schCategory')} open={catsOpen} toggle={() => setCatsOpen(o => !o)}>
        {CATEGORIES.map(c => {
          const icon = CATEGORY_ICONS[c] || "📋";
          const catKey = 'cat' + c.replace(/[^a-zA-Z]/g, '');
          const catLabel = t(catKey) !== catKey ? t(catKey) : c;
          return (
            <label key={c} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "5px 0" }}>
              <input type="checkbox" className="bl-check" checked={selectedCats.includes(c)}
                onChange={() => toggleFilter(selectedCats, setSelectedCats, c)} />
              <span style={{ fontSize: 13, color: "var(--text)", fontWeight: selectedCats.includes(c) ? 600 : 400 }}>
                {icon} {catLabel}
              </span>
            </label>
          );
        })}
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, open, toggle, children }) {
  return (
    <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <button onClick={toggle} style={{
        width: "100%", padding: "12px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "none", border: "none", cursor: "pointer",
        fontWeight: 600, fontSize: 12, color: "var(--text-heading)",
        textTransform: "uppercase", letterSpacing: "0.5px",
      }}>
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div style={{ padding: "4px 16px 14px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "var(--saffron-pale)", color: "var(--saffron)",
      border: "1px solid rgba(255,107,0,0.2)",
      borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 600,
    }}>
      {label}
      <button onClick={onRemove} style={{
        background: "none", border: "none", cursor: "pointer", color: "var(--saffron)",
        display: "flex", alignItems: "center", padding: 0,
      }}>
        <X size={12} />
      </button>
    </span>
  );
}
