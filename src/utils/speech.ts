const SPEECH_TIMEOUT_MS = 2200;
let speechRunId = 0;
let speechTimerId: number | null = null;
let preferredVoice: SpeechSynthesisVoice | undefined;
let listeningForVoices = false;

export const speechSupported =
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

function getPreferredVoice(): SpeechSynthesisVoice | undefined {
  if (!speechSupported) return undefined;
  if (preferredVoice) return preferredVoice;
  const voices = window.speechSynthesis.getVoices();
  preferredVoice =
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    voices[0];
  return preferredVoice;
}

function clearSpeechTimer(): void {
  if (speechTimerId === null) return;
  window.clearTimeout(speechTimerId);
  speechTimerId = null;
}

function finishOnce(onDone: () => void, runId: number): () => void {
  let finished = false;
  return () => {
    if (finished || runId !== speechRunId) return;
    finished = true;
    clearSpeechTimer();
    onDone();
  };
}

export function prepareSpeech(): void {
  if (!speechSupported) return;
  try {
    getPreferredVoice();
    if (!listeningForVoices) {
      listeningForVoices = true;
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        preferredVoice = undefined;
        getPreferredVoice();
      });
    }
  } catch {
    // Speech is optional.
  }
}

export function cancelSpeech(): void {
  if (!speechSupported) return;
  try {
    speechRunId += 1;
    clearSpeechTimer();
    window.speechSynthesis.cancel();
  } catch {
    // Speech is optional.
  }
}

export function speakThen(phrase: string, onDone: () => void): void {
  if (!speechSupported) {
    onDone();
    return;
  }
  try {
    cancelSpeech();
    const runId = speechRunId;
    const utterance = new SpeechSynthesisUtterance(phrase);
    const voice = getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.rate = 0.9;

    const finish = finishOnce(onDone, runId);
    speechTimerId = window.setTimeout(finish, SPEECH_TIMEOUT_MS);
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  } catch {
    onDone();
  }
}

export function speakWord(text: string): void {
  if (!speechSupported) return;
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech is optional.
  }
}
