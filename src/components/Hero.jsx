import React, { useEffect, useRef } from 'react';
import { useScrollY } from '../hooks/useScrollY';
import { AlertTriangle } from 'lucide-react';

export default function Hero({ calm }) {
  const canvasRef = useRef(null);
  const scrollY = useScrollY();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const mouse = { x: -999, y: -999 };
    const parent = canvas.parentElement;

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    const onMouseLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    window.addEventListener('resize', onResize);
    parent?.addEventListener('mousemove', onMouseMove);
    parent?.addEventListener('mouseleave', onMouseLeave);

    const makeParticle = (bottom) => ({
      x: Math.random() * w,
      y: bottom ? h + Math.random() * 40 : Math.random() * h,
      r: 1 + Math.random() * 2.4,
      v: 0.3 + Math.random() * 0.9,
      a: Math.random() * 6.28,
    });

    const particles = Array.from({ length: 65 }, () => makeParticle(false));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (!document.hidden) {
        particles.forEach((p, i) => {
          p.a += 0.05;
          p.y -= p.v;
          p.x += Math.sin(p.a) * 0.5;
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 0) {
            p.x += (dx / dist) * 2.2;
            p.y += (dy / dist) * 2.2;
          }
          if (p.y < -10) particles[i] = makeParticle(true);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, ${110 + ((p.r * 20) | 0)}, 0, ${0.35 + Math.sin(p.a) * 0.25})`;
          ctx.fill();
        });
      }
      animId = requestAnimationFrame(draw);
    };
    // Com "reduzir movimento" ligado não há animação nenhuma.
    if (calm) ctx.clearRect(0, 0, w, h);
    else draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      parent?.removeEventListener('mousemove', onMouseMove);
      parent?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [calm]);

  return (
    <>
      <section
        id="top"
        className="relative min-h-[96svh] overflow-hidden flex items-center justify-center text-center text-[#F5F5DC]"
        style={{ background: 'radial-gradient(120% 80% at 78% 105%, #7a3a0a 0%, #0B2E1B 55%)' }}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />
        <div className="smk pointer-events-none" />

        <svg
          className="absolute left-0 right-0 -bottom-px w-full h-[44%] pointer-events-none"
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 120 L90 70 L170 110 L270 40 L380 105 L480 60 L590 112 L690 66 L800 100 V200 H0Z"
            fill="#0F3A24"
            style={{ transform: calm ? undefined : `translateY(${(scrollY * 0.1).toFixed(1)}px)` }}
          />
          <path
            d="M0 160 L110 120 L210 150 L330 105 L450 150 L560 118 L680 152 L800 126 V200 H0Z"
            fill="#0B2E1B"
            style={{ transform: calm ? undefined : `translateY(${(scrollY * 0.2).toFixed(1)}px)` }}
          />
          <defs>
            <path
              id="forest-tree"
              d="M0 0 L-11 17 H-5 L-16 32 H-8 L-20 49 H-5 V61 H5 V49 H20 L8 32 H16 L5 17 H11 Z"
            />
          </defs>
          <g
            fill="#16452D"
            opacity="0.9"
            style={{ transform: calm ? undefined : `translateY(${(scrollY * 0.16).toFixed(1)}px)` }}
          >
            <use href="#forest-tree" transform="translate(30 145) scale(0.65)" />
            <use href="#forest-tree" transform="translate(79 163) scale(0.48)" />
            <use href="#forest-tree" transform="translate(126 150) scale(0.72)" />
            <use href="#forest-tree" transform="translate(183 169) scale(0.5)" />
            <use href="#forest-tree" transform="translate(259 177) scale(0.4)" />
            <use href="#forest-tree" transform="translate(541 178) scale(0.4)" />
            <use href="#forest-tree" transform="translate(618 165) scale(0.55)" />
            <use href="#forest-tree" transform="translate(676 151) scale(0.72)" />
            <use href="#forest-tree" transform="translate(732 166) scale(0.52)" />
            <use href="#forest-tree" transform="translate(780 143) scale(0.68)" />
          </g>
        </svg>

        <div
          className="relative z-10 px-5 pt-24 pb-28 max-w-4xl mx-auto"
          style={{ transform: calm ? undefined : `translateY(${(scrollY * 0.24).toFixed(1)}px)` }}
        >
          <h1 className="font-serif font-semibold leading-[1.06] tracking-tight text-[clamp(40px,7.5vw,88px)] mb-5">
            <span className="block anim-up">Juntos contra</span>
            <span className="block text-[#A5D6A7] anim-up-d1">as queimadas.</span>
          </h1>
          <p className="text-[clamp(17px,2.2vw,21px)] max-w-[36ch] mx-auto opacity-95 anim-up-d2">
            Informação, prevenção e cuidado com a Amazônia e o Brasil, no seu celular e em linguagem simples.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7 anim-up-d3">
            <a
              href="#risco"
              className="rounded-full px-7 py-3.5 font-bold bg-[#2E7D32] text-white hover:brightness-110 transition shadow-lg"
            >
              Ver o risco na região
            </a>
            <a
              href="#avisar"
              className="rounded-full px-7 py-3.5 font-bold border-2 border-[#A5D6A7] text-[#A5D6A7] hover:bg-[#A5D6A7]/10 transition"
            >
              Avisar sobre fogo
            </a>
          </div>
        </div>
      </section>

      <div className="relative z-20 max-w-xl w-[calc(100%-32px)] -mt-11 mx-auto p-5 rounded-3xl border border-[#2E7D32]/60 bg-gradient-to-br from-[#123F27] to-[#0B2E1B] text-[#F5F5DC] flex items-center gap-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-[#FB8C00] text-[#1B1F24] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <b className="block font-serif text-xl">Alerta de Queimada</b>
          <p className="text-sm opacity-90 mb-1">Acompanhe os focos de calor e a qualidade do ar da região.</p>
          <a href="#risco" className="text-[#FB8C00] font-bold text-sm hover:underline">
            Abrir mapa 3D →
          </a>
        </div>
      </div>
    </>
  );
}
