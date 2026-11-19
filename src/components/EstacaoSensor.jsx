import React from 'react';
import { Cpu, Volume2, Info, ArrowRight, ExternalLink, Github, MapPin } from 'lucide-react';
import {
  ESTACAO,
  SENSORES,
  LIMIARES,
  REGRA_FOGO,
  TELEMETRIA,
  QUALIDADE_AR,
  MARCAS_FUMACA,
  FLUXO,
  PYTHON_FAZ,
  TERRITORIOS,
  WOKWI_URL,
  RICHARD_REPO_URL,
} from '../data/estacao';

const CORES_AR = {
  BOM: { fundo: '#2E7D32', texto: 'text-white' },
  MODERADO: { fundo: '#FB8C00', texto: 'text-[#1B1F24]' },
  RUIM: { fundo: '#D32F2F', texto: 'text-white' },
  PERIGOSO: { fundo: '#7F0000', texto: 'text-white' },
};

function num(valor, unidade) {
  if (typeof valor !== 'number') return 'sem dado';
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}${unidade}`;
}

function SeloAr({ faixa }) {
  if (!faixa) return <span className="text-sm font-semibold text-[var(--mu)]">sem dado</span>;
  const cor = CORES_AR[faixa.id];
  return (
    <span
      style={{ backgroundColor: cor.fundo }}
      className={`inline-block font-extrabold text-sm px-3.5 py-1 rounded-full ${cor.texto}`}
    >
      {faixa.label}
    </span>
  );
}

function BarraFumaca({ valor, faixa }) {
  if (typeof valor !== 'number') return null;
  const pos = Math.min(100, Math.max(0, valor));
  const limites = [0, ...MARCAS_FUMACA, 100];
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pos}
      aria-valuetext={`Fumaça em ${num(valor, '%')}, ${faixa ? faixa.label.toLowerCase() : 'sem faixa'}`}
      aria-label="Nível de fumaça do sensor"
      className="mt-4"
    >
      <div className="relative h-4 rounded-full overflow-hidden flex border border-[var(--ln)]" aria-hidden="true">
        {QUALIDADE_AR.map((f, i) => (
          <span
            key={f.id}
            style={{ width: `${limites[i + 1] - limites[i]}%`, backgroundColor: CORES_AR[f.id].fundo }}
            className="h-full opacity-80"
          />
        ))}
      </div>
      <div className="relative h-7" aria-hidden="true">
        <span
          style={{ left: `${pos}%` }}
          className="absolute -top-6 -translate-x-1/2 w-1.5 h-8 rounded-full bg-[var(--ink)] ring-2 ring-[var(--sf)]"
        />
        {MARCAS_FUMACA.map((m) => (
          <span
            key={m}
            style={{ left: `${m}%` }}
            className="absolute top-1 -translate-x-1/2 text-[11px] font-semibold text-[var(--mu)]"
          >
            {m}%
          </span>
        ))}
        <span className="absolute top-1 left-0 text-[11px] font-semibold text-[var(--mu)]">0</span>
        <span className="absolute top-1 right-0 text-[11px] font-semibold text-[var(--mu)]">100</span>
      </div>
    </div>
  );
}

function Valor({ rotulo, valor, fonte }) {
  return (
    <div className="rounded-2xl bg-[var(--bg)] border border-[var(--ln)] p-3">
      <dt className="text-xs font-semibold text-[var(--mu)]">{rotulo}</dt>
      <dd className="font-serif font-semibold text-xl mt-0.5">{valor}</dd>
      {fonte && <dd className="text-[11px] text-[var(--mu)] mt-0.5">{fonte}</dd>}
    </div>
  );
}

export default function EstacaoSensor({ estacao, onSpeak }) {
  const { exemplo, ultima, ultimas, qualidade } = estacao;

  const fala = [
    exemplo ? 'Exemplo ilustrativo, nenhuma leitura da estação recebida ainda.' : '',
    `Estação simulada no Wokwi, ${ultima.territorio}.`,
    qualidade
      ? `Qualidade do ar pelo nível de fumaça: ${qualidade.label.toLowerCase()}, ${num(ultima.fumaca, ' por cento')}.`
      : 'Nível de fumaça sem dado.',
    ultima.estadoLabel ? `Estado do ESP32: ${ultima.estadoLabel.toLowerCase()}.` : '',
    ultima.motivoLabel ? `Motivo: ${ultima.motivoLabel.toLowerCase()}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id="estacao" className="py-16 px-4 bg-[var(--sf)] border-y border-[var(--ln)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--natureza)_15%,var(--sf))] text-[var(--natureza-texto)] mb-2">
            <Cpu className="w-3.5 h-3.5" aria-hidden="true" /> Estação simulada no Wokwi
          </span>
          <h2 className="font-serif font-semibold text-[clamp(28px,4.2vw,42px)] leading-tight mb-2">
            Estação de sensores
          </h2>
          <p className="text-[var(--mu)] text-sm sm:text-base">
            {ESTACAO.territorio}, {ESTACAO.cidade}. Um {ESTACAO.placa} simulado no Wokwi mede fumaça, chama,
            temperatura, umidade e o nível do rio. Os valores são simulados, não são medições do mundo real.
          </p>
        </div>

        {exemplo && (
          <p
            role="status"
            className="flex items-start gap-2.5 max-w-2xl mx-auto mb-6 p-4 rounded-2xl border-2 border-[#FB8C00] bg-[var(--bg)] text-sm font-semibold text-[var(--ink)]"
          >
            <Info className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>Exemplo ilustrativo: nenhuma leitura da estação recebida ainda.</span>
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" aria-live="polite">
          <article className="rounded-3xl border border-[var(--ln)] bg-[var(--bg)] p-5 sm:p-6">
            <h3 className="font-serif font-semibold text-xl">Qualidade do ar (nível de fumaça)</h3>
            <p className="text-xs text-[var(--mu)] mt-1 mb-4 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> {ultima.territorio}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <SeloAr faixa={qualidade} />
              <span className="font-serif font-semibold text-3xl">{num(ultima.fumaca, '%')}</span>
            </div>
            <BarraFumaca valor={ultima.fumaca} faixa={qualidade} />
            <p className="text-xs text-[var(--mu)] leading-relaxed">
              O percentual é um índice do sensor MQ-2 simulado, que reage a fumaça e gases. Não é um índice oficial de
              qualidade do ar.
            </p>

            <dl className="mt-4 pt-4 border-t border-[var(--ln)] grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs font-semibold text-[var(--mu)]">Estado do ESP32</dt>
                <dd className="font-bold">{ultima.estadoLabel || 'sem dado'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[var(--mu)]">Motivo</dt>
                <dd className="font-bold">{ultima.motivoLabel || 'sem dado'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[var(--mu)]">Nível do alerta (Python)</dt>
                <dd className="font-bold">{ultima.nivelLabel || 'sem dado'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[var(--mu)]">Recebido em</dt>
                <dd className="font-bold">{exemplo ? 'Exemplo, sem data' : ultima.data || 'sem data'}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => onSpeak(fala)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-[#FB8C00] text-[#1B1F24] font-bold text-sm hover:brightness-105 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" /> Ouvir
            </button>
          </article>

          <article className="rounded-3xl border border-[var(--ln)] bg-[var(--bg)] p-5 sm:p-6">
            <h3 className="font-serif font-semibold text-xl mb-4">Outras leituras</h3>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Valor rotulo="Chama" valor={num(ultima.chama, '%')} />
              <Valor rotulo="Temperatura" valor={num(ultima.temp, ' °C')} />
              <Valor rotulo="Umidade" valor={num(ultima.umid, '%')} />
              <Valor rotulo="Nível do rio" valor={num(ultima.rio, ' cm')} />
              <Valor rotulo="PM2,5" valor={num(ultima.pm25, ' µg/m³')} fonte="Open-Meteo, via Python" />
              <Valor rotulo="Vento" valor={num(ultima.vento, ' km/h')} fonte="Open-Meteo, via Python" />
            </dl>

            <h4 className="font-bold text-sm mt-6 mb-2">
              {exemplo ? 'Leituras do exemplo' : `Últimas ${ultimas.length === 1 ? 'leitura' : `${ultimas.length} leituras`}`}
            </h4>
            <ol className="space-y-2">
              {ultimas.map((l) => (
                <li
                  key={l.id}
                  className="flex flex-wrap gap-x-3 gap-y-0.5 items-baseline text-sm rounded-xl border border-[var(--ln)] px-3 py-2"
                >
                  <b>{l.nivelLabel || 'sem nível'}</b>
                  <span>Fumaça {num(l.fumaca, '%')}</span>
                  <span>Chama {num(l.chama, '%')}</span>
                  <span>{num(l.temp, ' °C')}</span>
                  <span className="text-xs text-[var(--mu)] basis-full">
                    {exemplo ? 'Exemplo ilustrativo' : l.data || 'sem data'}
                  </span>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className="mt-10">
          <h3 className="font-serif font-semibold text-2xl mb-4 text-center">Como medimos</h3>

          <ol className="flex flex-col md:flex-row md:flex-wrap items-stretch justify-center gap-2 mb-6">
            {FLUXO.map((f, i) => (
              <li key={f.etapa} className="flex flex-col md:flex-row items-center gap-2">
                <div className="w-full md:w-40 rounded-2xl border border-[var(--ln)] bg-[var(--bg)] p-3 text-center">
                  <b className="block text-sm">{f.etapa}</b>
                  <span className="block text-xs text-[var(--mu)] mt-0.5">{f.desc}</span>
                </div>
                {i < FLUXO.length - 1 && (
                  <ArrowRight className="w-4 h-4 shrink-0 text-[var(--mu)] rotate-90 md:rotate-0" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-3xl border border-[var(--ln)] bg-[var(--bg)] p-5">
              <h4 className="font-bold mb-3">Peças simuladas</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-[var(--ln)]">
                      <th scope="col" className="py-2 pr-3">Peça</th>
                      <th scope="col" className="py-2">O que faz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SENSORES.map((s) => (
                      <tr key={s.peca} className="border-b border-[var(--ln)] last:border-0">
                        <th scope="row" className="py-2 pr-3 font-semibold">{s.peca}</th>
                        <td className="py-2">{s.mede}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="font-bold mt-5 mb-2">Envio dos dados</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {TELEMETRIA.map((t) => (
                  <li key={t}>{t}</li>
                ))}
                <li>Protocolo MQTT pelo broker público broker.hivemq.com, porta 1883.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-[var(--ln)] bg-[var(--bg)] p-5">
              <h4 className="font-bold mb-3">Limiares do ESP32</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-[var(--ln)]">
                      <th scope="col" className="py-2 pr-2">Leitura</th>
                      <th scope="col" className="py-2 px-2">Atenção</th>
                      <th scope="col" className="py-2 px-2">Alerta</th>
                      <th scope="col" className="py-2 pl-2">Crítico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIMIARES.map((l) => (
                      <tr key={l.grandeza} className="border-b border-[var(--ln)] last:border-0">
                        <th scope="row" className="py-2 pr-2 font-semibold">
                          {l.grandeza}
                          {l.nota && <span className="block text-xs font-normal text-[var(--mu)]">{l.nota}</span>}
                        </th>
                        <td className="py-2 px-2 whitespace-nowrap">{l.atencao} {l.unidade}</td>
                        <td className="py-2 px-2 whitespace-nowrap">{l.alerta} {l.unidade}</td>
                        <td className="py-2 pl-2 whitespace-nowrap">{l.critico} {l.unidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm mt-3">
                {REGRA_FOGO.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>

              <h4 className="font-bold mt-5 mb-2">Qualidade do ar pela fumaça</h4>
              <ul className="flex flex-wrap gap-2 text-sm">
                {QUALIDADE_AR.map((f, i) => (
                  <li key={f.id} className="flex items-center gap-2">
                    <SeloAr faixa={f} />
                    <span>
                      {i === 0 ? `abaixo de ${QUALIDADE_AR[1].min}%` : `a partir de ${f.min}%`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--ln)] bg-[var(--bg)] p-5 mt-5">
            <h4 className="font-bold mb-2">O que o Python faz</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {PYTHON_FAZ.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="text-xs text-[var(--mu)] mt-3">
              Os alertas chegam ao site pela mesma API de avisos do formulário e aparecem na lista com a etiqueta
              "Estação (simulada)". Os cidadãos que recebem alertas no Python são fictícios.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="rounded-3xl border border-[var(--ln)] bg-[var(--bg)] p-5">
            <h3 className="font-serif font-semibold text-xl mb-2">Expansão planejada</h3>
            <p className="text-sm text-[var(--mu)] mb-3">Territórios já cadastrados no Python, ainda sem estação:</p>
            <ul className="space-y-2 text-sm">
              {TERRITORIOS.filter((t) => !t.estacao).map((t) => (
                <li key={t.nome} className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--natureza-texto)]" aria-hidden="true" />
                  <span>
                    <b>{t.nome}</b>, Manaus (AM). Ainda sem estação.
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[var(--ln)] bg-[var(--bg)] p-5">
            <h3 className="font-serif font-semibold text-xl mb-2">Código da estação</h3>
            <p className="text-sm text-[var(--mu)] mb-3">{ESTACAO.autores}.</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <a
                href={WOKWI_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 border-2 border-[var(--natureza)] text-[var(--ink)] font-bold text-sm hover:bg-[color-mix(in_srgb,var(--natureza)_10%,var(--bg))] transition"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" /> Projeto no Wokwi
              </a>
              <a
                href={RICHARD_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 border-2 border-[var(--natureza)] text-[var(--ink)] font-bold text-sm hover:bg-[color-mix(in_srgb,var(--natureza)_10%,var(--bg))] transition"
              >
                <Github className="w-4 h-4" aria-hidden="true" /> Python no GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
