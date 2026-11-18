import React from 'react';
import { Github } from 'lucide-react';
import { PROJECT_ORIGIN, GROUP, MEMBERS, APIS, OTHER_RESOURCES, REPO_URL } from '../data/about';

const linkClass = 'font-semibold text-[var(--natureza-texto)] underline underline-offset-2 hover:no-underline';

function ResourceList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.name}>
          <a className={linkClass} href={item.url} target="_blank" rel="noreferrer">
            {item.name}
          </a>
          <span className="block text-[var(--mu)]">{item.desc}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[var(--sf)] text-[var(--ink)] border-t border-[var(--ln)] px-4 pt-12 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif font-semibold text-3xl mb-8">Sobre o projeto</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9 text-sm leading-relaxed">
          <section aria-labelledby="rodape-ideia">
            <h3 id="rodape-ideia" className="font-bold text-base mb-2">
              De onde surgiu a ideia
            </h3>
            <p className="text-[var(--mu)] mb-6">{PROJECT_ORIGIN}</p>

            <h3 className="font-bold text-base mb-2">Sobre o grupo</h3>
            <p className="font-semibold">{GROUP.name}</p>
            <p className="text-[var(--mu)] mb-5">{GROUP.note}</p>

            <a
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-[var(--natureza)] text-[var(--natureza-texto)] font-bold hover:bg-[color-mix(in_srgb,var(--natureza)_10%,var(--sf))] transition"
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-4 h-4" aria-hidden="true" /> Ver o código no GitHub
            </a>
          </section>

          <section aria-labelledby="rodape-participantes">
            <h3 id="rodape-participantes" className="font-bold text-base mb-2">
              Participantes
            </h3>
            <ul className="space-y-2.5">
              {MEMBERS.map((m) => (
                <li key={m.name}>
                  <b className="block">{m.name}</b>
                  <span className="text-[var(--mu)]">{m.area}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="rodape-apis" className="md:col-span-2 lg:col-span-1">
            <h3 id="rodape-apis" className="font-bold text-base mb-2">
              APIs utilizadas
            </h3>
            <ResourceList items={APIS} />

            <h3 className="font-bold text-base mt-6 mb-2">Outros recursos</h3>
            <ResourceList items={OTHER_RESOURCES} />
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--ln)] text-xs text-[var(--mu)] leading-relaxed space-y-2">
          <p>
            SumaUma é um protótipo acadêmico da FIAP (Global Solution 2026.2). Qualidade do ar e clima:{' '}
            <a className="underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">
              Open-Meteo
            </a>{' '}
            com dados do Copernicus Atmosphere Monitoring Service (CC BY 4.0). Focos de calor:{' '}
            <a className="underline" href="https://terrabrasilis.dpi.inpe.br/queimadas/portal/" target="_blank" rel="noreferrer">
              INPE
            </a>
            . Orientações ilustrativas, sem substituir Defesa Civil, bombeiros ou brigadas.
          </p>
          <p>O VLibras é uma tradução automática e não substitui um intérprete humano.</p>
        </div>
      </div>
    </footer>
  );
}
