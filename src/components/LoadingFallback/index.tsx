import type { CSSProperties } from "react";

const containerStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--space-md)",
  fontFamily: "var(--font-family)",
  color: "var(--color-white)",
};

const spinnerStyle: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  border: "5px solid rgba(255,255,255,0.25)",
  borderTopColor: "var(--color-accent)",
  animation: "spin 0.8s linear infinite",
};

export default function LoadingFallback() {
  return (
    <div role="status" aria-live="polite" style={containerStyle}>
      <div style={spinnerStyle} />
      <span style={{ fontSize: "1.5rem", letterSpacing: "0.04em" }}>Loading…</span>
    </div>
  );
}
