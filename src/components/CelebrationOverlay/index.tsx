import { useEffect, useRef } from "react";
import LETTER_WORDS from "../../data/letterWords";
import styles from "../../pages/TracingScreen/index.module.css";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface Props {
  label: string;
  onRetry: () => void;
  onNext: () => void;
  onHome: () => void;
  hasNext: boolean;
}

export default function CelebrationOverlay({ label, onRetry, onNext, onHome, hasNext }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const letterData = LETTER_WORDS[label];

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const focusables = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE));
    focusables[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    card.addEventListener("keydown", onKeyDown);
    return () => card.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={styles.celebrationOverlay} role="dialog" aria-modal="true" aria-label="Great job!">
      <div className={styles.celebrationCard} ref={cardRef}>
        {letterData ? (
          <>
            <div className={styles.celebrationWordText}>{letterData.word}</div>
            <div className={styles.celebrationEmoji}>{letterData.emoji}</div>
          </>
        ) : (
          <div className={styles.celebrationLabel}>{label}</div>
        )}
        <div className={styles.celebrationActions}>
          <button className={`${styles.celebrationBtn} ${styles.celebrationBtnRetry}`} onClick={onRetry}>
            ↺ Retry
          </button>
          {hasNext ? (
            <button className={styles.celebrationBtn} onClick={onNext}>
              Next →
            </button>
          ) : (
            <button className={styles.celebrationBtn} onClick={onHome}>
              ⌂ Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
