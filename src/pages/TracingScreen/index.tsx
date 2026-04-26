import { useState, useEffect, useRef } from "react";
import TracingCanvas from "../../components/TracingCanvas";
import CelebrationOverlay from "../../components/CelebrationOverlay";
import type { StrokeItem } from "../../types";
import styles from "./index.module.css";
import LETTER_WORDS from "../../data/letterWords";
import {
  cancelSpeech,
  hasUnlockedSpeech,
  prepareSpeech,
  speakThen,
  speakWord,
  speechSupported,
  unlockSpeech,
} from "../../utils/speech";

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
  const [key, setKey] = useState(0);
  const [soundPromptOpen, setSoundPromptOpen] = useState(() => speechSupported && !hasUnlockedSpeech());
  const soundPromptButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => cancelSpeech, []);

  useEffect(() => {
    if (soundPromptOpen) {
      soundPromptButtonRef.current?.focus();
    }
  }, [soundPromptOpen]);

  function handleEnableSound() {
    unlockSpeech();
    setSoundPromptOpen(false);
  }

  function handleComplete() {
    const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    const letterData = LETTER_WORDS[item.label];

    setDone(true);
    prepareSpeech();
    speakThen(praise, () => {
      if (letterData) {
        speakWord(`${item.label} for ${letterData.word}`);
      } else {
        speakWord(item.label);
      }
    });
  }

  function handleRetry() {
    cancelSpeech();
    setDone(false);
    setKey((k) => k + 1);
  }

  function handleNext() {
    cancelSpeech();
    setDone(false);
    setKey((k) => k + 1);
    onNext();
  }

  function handleClose() {
    cancelSpeech();
    onClose();
  }

  return (
    <div className={styles.tracingScreen}>
      {!soundPromptOpen && (
        <>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close tracing screen">
            &times;
          </button>

          <div className={styles.canvasWrapper}>
            <TracingCanvas key={key} item={item} onComplete={handleComplete} />
          </div>

          {done && (
            <CelebrationOverlay
              label={item.label}
              onRetry={handleRetry}
              onNext={handleNext}
              onHome={handleClose}
              hasNext={hasNext}
            />
          )}
        </>
      )}

      {soundPromptOpen && (
        <div className={styles.soundPromptOverlay} role="dialog" aria-modal="true" aria-labelledby="sound-title">
          <div className={styles.soundPromptCard}>
            <h2 id="sound-title" className={styles.soundPromptTitle}>
              Turn on sound
            </h2>
            <p className={styles.soundPromptText}>Tap play sound to start tracing with voice.</p>
            <div className={styles.soundPromptActions}>
              <button ref={soundPromptButtonRef} className={styles.soundPromptPrimary} onClick={handleEnableSound}>
                Play sound
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
