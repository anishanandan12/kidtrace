import { useState, useEffect } from "react";
import TracingCanvas from "../../components/TracingCanvas";
import CelebrationOverlay from "../../components/CelebrationOverlay";
import type { StrokeItem } from "../../types";
import styles from "./index.module.css";
import LETTER_WORDS from "../../data/letterWords";
import { speechSupported, speakThen, speakWord } from "../../utils/speech";

const PRAISE = [
  "Amazing!",
  "Super!",
  "Great job!",
  "You are too good!",
  "Awesome!",
  "Magnificent!",
  "Wonderful!",
  "Fantastic!",
  "Brilliant!",
];

export default function TracingScreen({
  item,
  onClose,
  onNext,
  hasNext,
}: {
  item: StrokeItem;
  onClose: () => void;
  onNext: () => void;
  hasNext: boolean;
}) {
  const [done, setDone] = useState(false);

  useEffect(() => () => { if (speechSupported) window.speechSynthesis.cancel(); }, []);
  const [key, setKey] = useState(0);

  function handleComplete() {
    const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    const letterData = LETTER_WORDS[item.label];
    // 1. Speak praise → 2. show overlay → 3. speak "A for Apple"
    speakThen(praise, () => {
      setDone(true);
      if (letterData) {
        speakWord(`${item.label} for ${letterData.word}`);
      } else {
        speakWord(item.label);
      }
    });
  }

  function handleRetry() {
    setDone(false);
    setKey((k) => k + 1);
  }

  function handleNext() {
    setDone(false);
    setKey((k) => k + 1);
    onNext();
  }

  return (
    <div className={styles.tracingScreen}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close tracing screen">
        ✕
      </button>

      <div className={styles.canvasWrapper}>
        <TracingCanvas key={key} item={item} onComplete={handleComplete} />
      </div>

      {done && (
        <CelebrationOverlay
          label={item.label}
          onRetry={handleRetry}
          onNext={handleNext}
          onHome={onClose}
          hasNext={hasNext}
        />
      )}
    </div>
  );
}
