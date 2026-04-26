import React from "react";
import type { Data } from "../../types";
import { prepareSpeech } from "../../utils/speech";
import "./index.css";

const CATEGORIES: {
  id: keyof Data;
  label: string;
  subtitle: string;
  icon: string;
  color: string;
}[] = [
  { id: "letters", label: "ABC", subtitle: "Alphabets", icon: "Aa", color: "#F5A623" },
  { id: "numbers", label: "123", subtitle: "Numbers", icon: "123", color: "#4A90D9" },
  { id: "shapes", label: "△○□", subtitle: "Shapes", icon: "△○□", color: "#9B59B6" },
];

export default function HomeScreen({ onSelect }: { onSelect: (cat: keyof Data) => void }) {
  return (
    <div className="home-screen">
      <div className="home-title">
        <span>Let&apos;s Trace!</span>
      </div>
      <div className="home-subtitle">Tap a category to start</div>
      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="category-card"
            style={{ "--card-color": cat.color } as React.CSSProperties}
            onPointerDown={prepareSpeech}
            onClick={() => onSelect(cat.id)}
            aria-label={`Select ${cat.subtitle} category`}
          >
            <div className="category-big-label">{cat.label}</div>
            <div className="category-subtitle">{cat.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
