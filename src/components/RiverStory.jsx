import React, { useEffect, useRef, useState } from 'react';
import { Flame, Smartphone, ShieldAlert, Check } from 'lucide-react';

const STEPS = [
  {
    title: 'O fogo é visto de cima',
    desc: 'Satélites e dados oficiais mostram onde há focos de calor, sempre com data e grau de confiança.',
    tag: 'Fonte: INPE',
    icon: Flame,
  },
  {
    title: 'O aviso desce o rio',
    desc: 'Chega no WhatsApp, por SMS ou na rádio da comunidade, em texto curto e com áudio.',
    tag: 'Para quem tem pouco sinal',
    icon: Smartphone,
  },
  {
    title: 'A ajuda se organiza',
    desc: 'Brigada, agente de saúde e vizinhos recebem o mesmo pedido e ninguém se perde no caminho.',
    tag: 'Um pedido, todos sabem',
    icon: ShieldAlert,
  },
  {
    title: 'Você diz se deu certo',
    desc: 'Depois, a SumaUma pergunta se você foi atendido. Sem resposta, o pedido continua aberto.',
    tag: 'Ninguém fica sem retorno',
    icon: Check,
  },
];

export default function RiverStory() {
  const containerRef = useRef(null);
  const rowRefs = useRef([]);
  const [progress, setProgress] = useState(0);
  const [dims, setDims] = useState({ w: 800, h: 720 });
  const [ys, setYs] = useState(() => STEPS.map((_, i) => ((i + 0.5) / STEPS.length) * 720));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const top = el.getBoundingClientRect().top;
      setDims({ w: el.clientWidth, h: el.clientHeight });
      setYs(
        rowRefs.current.map((row) => {
          if (!row) return 0;
          const r = row.getBoundingClientRect();
          return r.top - top + r.height / 2;
        })
      );
    };

    let frame = 0;
    const readScroll = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      setProgress(Math.max(0, Math.min(1, (window.innerHeight * 0.62 - rect.top) / rect.height)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(readScroll);
    };

    measure();
    readScroll();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const isMobile = dims.w < 720;
  const cx = isMobile ? 28 : dims.w / 2;
  const amp = isMobile ? 12 : Math.min(64, dims.w * 0.08);
  const getX = (y) => cx + amp * Math.sin((y / dims.h) * Math.PI * 3.4);

  let pathD = `M ${getX(0).toFixed(1)} 0`;
  for (let y = 12; y <= dims.h; y += 12) {
    pathD += ` L ${getX(y).toFixed(1)} ${y}`;
  }

  return (
    <section id="como" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-lg mx-auto mb-8">
        <h2 className="font-serif font-semibold text-[clamp(30px,4.4vw,44px)] leading-tight mb-2">
          O aviso segue o rio
        </h2>
        <p className="text-[var(--mu)] text-sm sm:text-base">
          Na Amazônia, o rio é a estrada. O aviso faz o mesmo caminho, do foco de fogo até a sua casa.
        </p>
      </div>

      <div ref={containerRef} className="relative py-4">
        <svg
          width={dims.w}
          height={dims.h}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-visible"
        >
          <defs>
            <linearGradient id="riverGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={dims.h}>
              <stop offset="0%" stopColor="#FB8C00" />
              <stop offset="30%" stopColor="#2E7D32" />
              <stop offset="100%" stopColor="#66BB6A" />
            </linearGradient>
          </defs>
          <path d={pathD} pathLength="1" fill="none" stroke="var(--ln)" strokeWidth="14" strokeLinecap="round" />
          <path
            d={pathD}
            pathLength="1"
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="1 2"
            strokeDashoffset={1 - progress}
          />
          <path
            d={pathD}
            pathLength="1"
            fill="none"
            stroke="#F5F5DC"
            strokeOpacity="0.65"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="0.01 0.045"
            className="gl"
          />
        </svg>

        <div className="space-y-12 sm:space-y-16 relative z-10">
          {STEPS.map((step, idx) => {
            const nodeY = ys[idx] ?? 0;
            const active = progress * dims.h >= nodeY - 24;
            const Icon = step.icon;
            const isRight = idx % 2 === 1;
            const nodeX = getX(nodeY);

            return (
              <div
                key={step.title}
                ref={(node) => {
                  rowRefs.current[idx] = node;
                }}
                className={`relative flex items-center min-h-[150px] ${
                  isRight ? 'md:justify-end' : 'md:justify-start'
                }`}
              >
                <div
                  style={{ left: `${nodeX}px` }}
                  className={`absolute -translate-x-1/2 w-12 h-12 rounded-full border-[3px] grid place-items-center transition-all duration-500 ${
                    active
                      ? idx === 0
                        ? 'bg-[#FB8C00] border-[#FB8C00] text-[#1B1F24] scale-110 shadow-md'
                        : 'bg-[var(--natureza)] border-[var(--natureza)] text-white scale-110 shadow-md'
                      : 'bg-[var(--bg)] border-[var(--ln)] text-[var(--ink)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div
                  className={`ml-16 md:ml-0 md:w-[calc(50%-64px)] transition-opacity duration-500 ${
                    active ? 'opacity-100' : 'opacity-80'
                  } ${isRight ? 'md:text-left' : 'md:text-right'}`}
                >
                  <h3 className="font-serif font-semibold text-2xl sm:text-3xl mb-1">{step.title}</h3>
                  <p className="text-sm sm:text-base text-[var(--mu)] mb-2">{step.desc}</p>
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full border border-[var(--ln)] bg-[var(--sf)]">
                    {step.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
