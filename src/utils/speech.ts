export const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

export function speakThen(phrase: string, onDone: () => void): void {
  if (!speechSupported) {
    onDone();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(phrase);
    u.rate = 0.9;
    let resolved = false;

    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        window.clearTimeout(fallback);
        onDone();
      }
    };

    // Safari/iPad may not reliably fire onend/onerror. Use a fallback timeout.
    const fallback = window.setTimeout(cleanup, 3000);
    u.onend = cleanup;
    u.onerror = cleanup;

    window.speechSynthesis.speak(u);
  } catch {
    onDone();
  }
}

export function speakWord(text: string): void {
  if (!speechSupported) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  } catch {
    // silently ignore — speech is non-critical
  }
}
