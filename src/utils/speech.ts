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
    u.onend = onDone;
    u.onerror = onDone;
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
