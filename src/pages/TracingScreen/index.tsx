import { useState, useEffect, useRef } from "react";
import TracingCanvas from "../../components/TracingCanvas";
import CelebrationOverlay from "../../components/CelebrationOverlay";
import type { StrokeItem } from "../../types";
import styles from "./index.module.css";
import LETTER_WORDS from "../../data/letterWords";
import {
  cancelSpeech,
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
  const [soundReady, setSoundReady] = useState(false);
  const [soundPromptOpen, setSoundPromptOpen] = useState(speechSupported);
  const soundPromptButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => cancelSpeech, []);

  useEffect(() => {
    if (soundPromptOpen) {
      soundPromptButtonRef.current?.focus();
    }
  }, [soundPromptOpen]);

  function handleEnableSound() {
    unlockSpeech();
    setSoundReady(true);
    setSoundPromptOpen(false);
  }

  function handleSkipSound() {
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
      <button className={styles.closeBtn} onClick={handleClose} aria-label="Close tracing screen">
        &times;
      </button>

      {!soundPromptOpen && (
        <button
          className={`${styles.soundBtn} ${soundReady ? styles.soundBtnReady : ""}`}
          onClick={handleEnableSound}
          aria-label={soundReady ? "Sound is on" : "Turn sound on"}
          aria-pressed={soundReady}
        >
          {soundReady ? "Sound on" : "Sound"}
        </button>
      )}

      <div className={styles.canvasWrapper}>
        <TracingCanvas key={key} item={item} onComplete={handleComplete} onTraceStart={handleEnableSound} />
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

      {soundPromptOpen && (
        <div className={styles.soundPromptOverlay} role="dialog" aria-modal="true" aria-labelledby="sound-title">
          <div className={styles.soundPromptCard}>
            <h2 id="sound-title" className={styles.soundPromptTitle}>
              Sound on?
            </h2>
            <div className={styles.soundPromptActions}>
              <button ref={soundPromptButtonRef} className={styles.soundPromptPrimary} onClick={handleEnableSound}>
                Sound on
              </button>
              <button className={styles.soundPromptSecondary} onClick={handleSkipSound}>
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
