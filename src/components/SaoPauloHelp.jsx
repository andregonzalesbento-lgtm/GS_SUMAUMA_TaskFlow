import React, { useState, useEffect } from 'react';
import { HeartHandshake, Wind, Share2, CheckCircle2 } from 'lucide-react';
import { SP_ACTIONS } from '../data/regions';

const ICONS = [HeartHandshake, Wind, Share2];

export default function SaoPauloHelp({ onNotify }) {
  const [selectedIds, setSelectedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('suma_sp_actions') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('suma_sp_actions', JSON.stringify(selectedIds));
    } catch {}
  }, [selectedIds]);

  const toggleAction = (item) => {
    const exists = selectedIds.includes(item.id);
    const next = exists ? selectedIds.filter((id) => id !== item.id) : [...selectedIds, item.id];
    setSelectedIds(next);
    if (!exists && onNotify) {
      onNotify(`Ação ativada: ${item.title}.`);
    }
  };

  return (
    <section id="sp-ajuda" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[color:var(--natureza)]/15 text-[var(--natureza)] mb-2">
          São Paulo + Amazônia
        </span>
        <h2 className="font-serif font-semibold text-[clamp(28px,4.2vw,42px)] leading-tight mb-2">
          Como SP pode apoiar
        </h2>
        <p className="text-[var(--mu)] text-sm sm:text-base">
          Use dados de fumaça e clima para apoiar brigadas e proteger a saúde em SP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SP_ACTIONS.map((item, idx) => {
          const Icon = ICONS[idx % ICONS.length];
          const active = selectedIds.includes(item.id);

          return (
            <article
              key={item.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                active
                  ? 'border-[var(--natureza)] bg-[color:var(--natureza)]/10 shadow-md'
                  : 'border-[var(--ln)] bg-[var(--sf)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="w-11 h-11 rounded-2xl bg-[var(--natureza)] text-white grid place-items-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full border border-[var(--ln)] text-[var(--mu)]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-serif font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--mu)] leading-relaxed mb-4">{item.desc}</p>
              </div>

              <div>
                {active && (
                  <p className="text-xs font-semibold text-[var(--natureza)] mb-3 flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{item.detail}</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => toggleAction(item)}
                  className={`w-full rounded-full py-2.5 px-4 text-sm font-bold transition cursor-pointer ${
                    active
                      ? 'bg-[var(--natureza)] text-white'
                      : 'border-2 border-[var(--natureza)] text-[var(--ink)] hover:bg-[color:var(--natureza)]/10'
                  }`}
                >
                  {active ? 'Ativada ✓' : item.cta}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
