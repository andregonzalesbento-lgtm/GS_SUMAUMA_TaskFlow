import { useCallback } from 'react';

export function useSpeech(enabled) {
  return useCallback(
    (text, force = false) => {
      if (!force && !enabled) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'pt-BR';
        window.speechSynthesis.speak(u);
      } catch {
      }
    },
    [enabled]
  );
}
