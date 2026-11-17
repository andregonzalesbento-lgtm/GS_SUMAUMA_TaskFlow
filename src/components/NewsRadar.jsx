import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, BellRing, Check } from 'lucide-react';
import { NEWS, NEWS_CHECKED_AT } from '../data/news';

export default function NewsRadar() {
  const [contact, setContact] = useState('');
  const [subscribed, setSubscribed] = useState(() => {
    try {
      return localStorage.getItem('suma_newsletter') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      if (subscribed) localStorage.setItem('suma_newsletter', subscribed);
    } catch {}
  }, [subscribed]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubscribed(contact.trim());
    setContact('');
  };

  return (
    <section id="noticias" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FB8C00]/20 text-[var(--ink)] mb-2">
          <Newspaper className="w-3.5 h-3.5 text-[#FB8C00]" /> Notícias verificadas
        </span>
        <h2 className="font-serif font-semibold text-[clamp(28px,4.2vw,42px)] leading-tight mb-2">
          Notícias ambientais
        </h2>
        <p className="text-[var(--mu)] text-sm sm:text-base">
          Reportagens reais sobre queimadas, fumaça e saúde, com link para a matéria original.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        {NEWS.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-[var(--ln)] bg-[var(--sf)] p-5 flex flex-col justify-between"
          >
            <div>
              <span className="inline-block text-[11px] font-bold text-[var(--natureza-texto)] mb-2">
                {item.region}
              </span>
              <h3 className="font-serif font-semibold text-lg leading-snug mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--mu)] leading-relaxed mb-4">
                {item.summary}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--ln)] flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--mu)]">
                {item.source} • {item.date}
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[var(--natureza-texto)] hover:underline"
              >
                Ver matéria <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="text-[11px] text-[var(--mu)] text-center mb-6">
        Títulos e datas conferidos em {NEWS_CHECKED_AT}. Os resumos são do projeto e não substituem a leitura da matéria.
      </p>

      <div className="rounded-3xl border border-[var(--ln)] bg-[var(--sf)] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left max-w-md">
          <div className="inline-flex items-center gap-2 font-serif font-semibold text-2xl mb-1">
            <BellRing className="w-6 h-6 text-[#FB8C00]" />
            <span>Boletim SumaUma</span>
          </div>
          <p className="text-sm text-[var(--mu)]">
            Lista de interessados em um resumo sobre fumaça na Amazônia e impactos em SP. Protótipo: o contato fica salvo só neste aparelho e nenhum boletim é enviado.
          </p>
        </div>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--natureza)] text-white text-sm font-bold">
            <Check className="w-5 h-5" />
            <span>Contato salvo: {subscribed}</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="E-mail ou WhatsApp"
              aria-label="E-mail ou WhatsApp"
              className="px-4 py-3 rounded-full border-2 border-[var(--campo)] bg-[var(--bg)] text-sm min-w-[240px] placeholder:text-[var(--mu)] focus:outline-none focus:border-[var(--natureza)]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[var(--natureza)] text-white font-bold text-sm hover:brightness-110 transition cursor-pointer"
            >
              Entrar na lista
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
