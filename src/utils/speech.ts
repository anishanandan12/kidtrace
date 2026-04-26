export const speechSupported =
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  typeof SpeechSynthesisUtterance !== "undefined";

let speechUnlocked = false;

function getSpeechVoice(): SpeechSynthesisVoice | undefined {
  if (!speechSupported) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => /en(-|_)?/.test(voice.lang)) ?? voices[0];
}

export function unlockSpeech(): void {
  if (!speechSupported || speechUnlocked) return;
  speechUnlocked = true;
  try {
    const silent = new SpeechSynthesisUtterance(" ");
    silent.volume = 0;
    silent.rate = 1;
    silent.pitch = 1;
    silent.lang = "en-US";
    const voice = getSpeechVoice();
    if (voice) silent.voice = voice;
    silent.onend = () => {
      /* unlocked */
    };
    silent.onerror = () => {
      /* ignore */
    };
    window.speechSynthesis.speak(silent);
  } catch {
    /* ignore */
  }
}

export function speakThen(phrase: string, onDone: () => void): void {
  if (!speechSupported) {
    onDone();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(phrase);
    u.rate = 0.9;
    u.volume = 1;
    u.pitch = 1;
    u.lang = "en-US";
    const voice = getSpeechVoice();
    if (voice) u.voice = voice;

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
    u.volume = 1;
    u.pitch = 1;
    u.lang = "en-US";
    const voice = getSpeechVoice();
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  } catch {
    // silently ignore — speech is non-critical
  }
}
