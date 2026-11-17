import { useCallback } from 'react';

// Leitura em voz alta (Web Speech API). Só fala se "enabled" ou se force = true.
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
        /* navegador sem suporte a síntese de voz */
      }
    },
    [enabled]
  );
}
