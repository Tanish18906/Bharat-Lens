// Shimmer skeleton loader components for Bharat Lens
export function ChatShimmer() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "16px 0" }}>
      {/* Assistant shimmer bubble */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div className="shimmer" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="shimmer" style={{ height: 16, borderRadius: 8, width: "80%" }} />
          <div className="shimmer" style={{ height: 16, borderRadius: 8, width: "60%" }} />
          <div className="shimmer" style={{ height: 16, borderRadius: 8, width: "70%" }} />
          <div className="shimmer" style={{ height: 10, borderRadius: 8, width: "35%", marginTop: 4 }} />
        </div>
      </div>
    </div>
  );
}

export function SchemeCardShimmer() {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 20,
      border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
        <div className="shimmer" style={{ width: 44, height: 44, borderRadius: 12 }} />
        <div style={{ flex: 1 }}>
          <div className="shimmer" style={{ height: 14, borderRadius: 6, marginBottom: 8, width: "70%" }} />
          <div className="shimmer" style={{ height: 10, borderRadius: 6, width: "40%" }} />
        </div>
      </div>
      <div className="shimmer" style={{ height: 12, borderRadius: 6, marginBottom: 6 }} />
      <div className="shimmer" style={{ height: 12, borderRadius: 6, width: "85%", marginBottom: 16 }} />
      <div className="shimmer" style={{ height: 36, borderRadius: 10 }} />
    </div>
  );
}

export function VerifyShimmer() {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 24,
      border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)",
    }}>
      <div className="shimmer" style={{ height: 100, borderRadius: 12, marginBottom: 16 }} />
      <div className="shimmer" style={{ height: 16, borderRadius: 8, width: "60%", marginBottom: 10 }} />
      <div className="shimmer" style={{ height: 12, borderRadius: 8, width: "80%", marginBottom: 8 }} />
      <div className="shimmer" style={{ height: 12, borderRadius: 8, width: "70%" }} />
    </div>
  );
}

export function ThinkingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--saffron)",
            animation: `bounce 1.2s ease infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%             { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
