import React, { useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

export default function SettingsSheet({ open, onClose, settings, onUpdate }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const html = document.documentElement;
    html.classList.add('painel-aberto');
    closeBtnRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      html.classList.remove('painel-aberto');
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const channels = [
    settings.wa && 'WhatsApp',
    settings.sms && 'SMS',
    settings.rad && 'rádio comunitária',
  ].filter(Boolean);

  const toggleBool = (key) => {
    try {
      navigator.vibrate?.(8);
    } catch {}
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Do seu jeito"
        className="relative z-10 w-full max-w-lg max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-[var(--sf)] text-[var(--ink)] p-5 pb-8 shadow-2xl border-t border-[var(--ln)]"
      >
        <div className="w-11 h-1.5 rounded-full bg-[var(--ln)] mx-auto mb-3" />

        <div className="flex items-center justify-between gap-3 mb-1">
          <h2 className="font-serif font-semibold text-2xl">Do seu jeito</h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[var(--natureza)] text-white font-bold text-sm cursor-pointer"
          >
            Pronto
          </button>
        </div>
        <p className="text-xs text-[var(--mu)] mb-4">
          Personalize a leitura, o contraste e os canais de alerta. Tudo vale na hora.
        </p>

        <div className="rounded-2xl bg-[var(--bg)] p-3.5 mb-3">
          <b className="block text-sm mb-2">Tamanho das letras</b>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--ln)]">
            {['Normal', 'Grande', 'Enorme'].map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => onUpdate({ ...settings, sz: idx })}
                className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  (settings.sz || 0) === idx ? 'bg-[var(--natureza)] text-white' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--bg)] p-3.5 mb-4">
          <b className="block text-sm mb-2">Aparência</b>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--ln)]">
            {['Automática', 'Clara', 'Escura'].map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => onUpdate({ ...settings, th: idx })}
                className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  (settings.th || 0) === idx ? 'bg-[var(--natureza)] text-white' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--bg)] divide-y divide-[var(--ln)] px-4">
          {[
            ['voz', 'Ouvir avisos em voz alta', 'Lê a orientação da sua região'],
            ['hc', 'Alto contraste', 'Bordas e textos mais fortes'],
            ['calm', 'Reduzir movimento', 'Pausa brasas e animações'],
            ['wa', 'Avisos por WhatsApp', 'Mensagem curta com áudio'],
            ['sms', 'Avisos por SMS', 'Funciona com pouco sinal'],
            ['rad', 'Rádio comunitária', 'Para áreas sem internet'],
            ['off', 'Simular sem sinal', 'Testa a fila de envio offline'],
          ].map(([key, title, sub]) => {
            const checked = !!settings[key];
            return (
              <button
                key={key}
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => toggleBool(key)}
                className="w-full py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <span>
                  <b className="block text-sm">{title}</b>
                  <small className="text-xs text-[var(--mu)]">{sub}</small>
                </span>
                <span
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 ${
                    checked ? 'bg-[#34C759]' : 'bg-[#546E63]'
                  }`}
                >
                  <span
                    className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${
                      checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div role="status" className="mt-4">
          {channels.length ? (
            <div className="p-4 rounded-2xl bg-[var(--natureza)] text-white text-sm">
              <b className="block font-semibold">Canais escolhidos: {channels.join(', ')}.</b>
              <span className="block mt-1">
                Protótipo: a escolha fica salva neste aparelho. As mensagens ainda não são enviadas de verdade.
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--bg)] border border-[var(--ln)] text-[var(--ink)] text-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <b className="block font-semibold">
                  Nenhum canal de aviso escolhido. Você vê os alertas só aqui no site.
                </b>
                <span className="block mt-1 text-[var(--mu)]">Protótipo: nada é enviado de verdade.</span>
              </span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
