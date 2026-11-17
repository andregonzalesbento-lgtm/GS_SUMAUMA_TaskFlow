import React, { useState } from 'react';
import { PhoneCall, Send, Trash2, CheckCircle, ArrowRight } from 'lucide-react';
import { API_URL } from '../services/api';

const REPORT_TYPES = ['Fumaça no ar', 'Fogo perto de casa', 'Fogo na mata'];
const STAGES = ['Enviado', 'Brigada acionada', 'Atendido'];

export default function ReportForm({
  regions,
  items,
  error,
  isOfflineSim,
  onCreate,
  onAdvance,
  onConfirm,
  onDelete,
}) {
  const [selectedType, setSelectedType] = useState(0);
  const [zone, setZone] = useState(regions[1]?.name || 'Lábrea');
  const [details, setDetails] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const res = await onCreate({
      k: selectedType,
      z: zone,
      d: details.trim(),
      s: 0,
      cf: 0,
    });
    setSending(false);
    if (res.ok) setDetails('');
    setFeedback(res);
  };

  return (
    <section id="avisar" className="py-16 px-4 bg-[var(--sf)] border-y border-[var(--ln)]">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-serif font-semibold text-[clamp(30px,4.4vw,44px)] leading-tight mb-2">
            Viu fogo ou fumaça? Avise.
          </h2>
          <p className="text-sm text-[var(--mu)]">
            Envie em menos de 1 minuto. Sem internet, o aviso fica na fila até a conexão voltar.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-[#FB8C00] bg-[#FB8C00]/10 p-5 text-center mb-6">
          <b className="block text-base mb-3">Emergência? Ligue antes de enviar o aviso.</b>
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            <a href="tel:193" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FB8C00] text-[#1B1F24] font-bold text-sm">
              <PhoneCall className="w-4 h-4" /> 193 Bombeiros
            </a>
            <a href="tel:199" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FB8C00] text-[#1B1F24] font-bold text-sm">
              <PhoneCall className="w-4 h-4" /> 199 Defesa Civil
            </a>
            <a href="tel:0800618080" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FB8C00] text-[#1B1F24] font-bold text-sm">
              0800 61 8080 Ibama
            </a>
          </div>
          <p className="text-xs text-[var(--mu)]">
            Não combata fogo na mata sozinho. Alertas da Defesa Civil: envie seu CEP por SMS para 40199.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {REPORT_TYPES.map((label, idx) => (
              <button
                key={label}
                type="button"
                aria-pressed={selectedType === idx}
                onClick={() => setSelectedType(idx)}
                className={`p-3.5 rounded-2xl border-2 font-bold text-sm transition cursor-pointer ${
                  selectedType === idx
                    ? 'border-[#FB8C00] bg-[#FB8C00]/15 -translate-y-0.5'
                    : 'border-[var(--ln)] bg-[var(--bg)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="report-zone" className="block font-bold text-sm mb-1">
              Local
            </label>
            <select
              id="report-zone"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-[var(--campo)] bg-[var(--bg)] font-medium"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="report-desc" className="block font-bold text-sm mb-1">
              Detalhes (opcional)
            </label>
            <textarea
              id="report-desc"
              rows={2}
              maxLength={280}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Ex.: fumaça perto da estrada."
              className="w-full p-3 rounded-xl border-2 border-[var(--campo)] bg-[var(--bg)] placeholder:text-[var(--mu)]"
            />
          </div>

          <p className="text-xs text-[var(--mu)]">
            {isOfflineSim
              ? 'Sem internet: aviso salvo na fila.'
              : API_URL
              ? 'Aviso salvo no servidor.'
              : 'Aviso salvo neste aparelho. Defina VITE_API_URL no arquivo .env para sincronizar na nuvem.'}
            {' '}Protótipo: o aviso é registrado no sistema, mas não chega a bombeiros reais.
          </p>

          {feedback && (
            <p
              role={feedback.ok ? 'status' : 'alert'}
              className={`text-sm font-semibold ${feedback.ok ? 'text-[var(--natureza-texto)]' : 'text-[var(--erro)]'}`}
            >
              {feedback.message}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 bg-[var(--natureza)] text-white font-bold hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            <Send className="w-4 h-4" /> {sending ? 'Enviando…' : 'Enviar aviso'}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-6 text-sm font-semibold text-[var(--erro)]">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {items.map((item) => {
            const isQueued = item.s < 0;
            return (
              <article key={item.id} className="rounded-2xl border border-[var(--ln)] bg-[var(--bg)] p-4">
                <b className="block text-base">
                  {REPORT_TYPES[item.k]} em {item.z}
                </b>
                {item.d && <p className="text-sm text-[var(--mu)] mt-1">{item.d}</p>}

                <ol className="flex gap-1.5 my-3 text-[11px]">
                  {STAGES.map((st, idx) => (
                    <li
                      key={st}
                      className={`flex-1 pt-1 border-t-4 ${
                        item.s >= idx ? 'border-[var(--natureza)] font-bold' : 'border-[var(--ln)] text-[var(--mu)]'
                      }`}
                    >
                      {st}
                    </li>
                  ))}
                  <li
                    className={`flex-1 pt-1 border-t-4 ${
                      item.cf ? 'border-[var(--natureza)] font-bold' : 'border-[var(--ln)] text-[var(--mu)]'
                    }`}
                  >
                    Confirmação
                  </li>
                </ol>

                <div className="flex flex-wrap gap-2 items-center pt-1">
                  {isQueued && (
                    <span className="text-xs text-[var(--mu)]">Na fila até a conexão voltar.</span>
                  )}
                  {!isQueued && item.s < 2 && (
                    <button
                      type="button"
                      onClick={() => onAdvance(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--natureza)] text-white text-xs font-bold cursor-pointer"
                    >
                      Simular etapa <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!isQueued && item.s === 2 && !item.cf && (
                    <button
                      type="button"
                      onClick={() => onConfirm(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FB8C00] text-[#1B1F24] text-xs font-bold cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Confirmar atendimento
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--ln)] text-xs font-semibold hover:border-[var(--erro)] hover:text-[var(--erro)] transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
