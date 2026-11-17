import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Layers, RotateCcw } from 'lucide-react';
import { RISK_LEVELS } from '../data/regions';
import { BRAZIL_STATES, MAP_BOUNDS, MAP_BOX } from '../data/brazilStates';

const MAP_WIDTH = 520;
const MAP_HEIGHT = 400;

function getMapPosition(lat, lon) {
  const x = MAP_BOX.x + ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * MAP_BOX.width;
  const y = MAP_BOX.y + ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * MAP_BOX.height;

  return {
    left: `${(x / MAP_WIDTH) * 100}%`,
    top: `${(y / MAP_HEIGHT) * 100}%`,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function Map3D({ regions, selectedIdx, onSelect, status, onSpeak }) {
  const [is3D, setIs3D] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const current = regions[selectedIdx] || regions[1];
  const levelIdx = current.pm <= 15 ? 0 : current.pm <= 50 ? 1 : 2;
  const level = RISK_LEVELS[levelIdx];
  const gaugeOffset = 283 * (1 - Math.min(100, current.pm) / 100);
  const saoPauloPosition = getMapPosition(-23.5505, -46.6333);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 4) {
        drag.moved = true;
        suppressClickRef.current = true;
      }
      if (!drag.moved) return;

      setRotation({
        x: clamp(drag.rotationX + dy * 0.35, -10, 22),
        y: clamp(drag.rotationY + dx * 0.45, -30, 30),
      });
    };

    const handlePointerEnd = (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      dragRef.current = null;
      setIsDragging(false);
      if (drag.moved) {
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    };

    const handleClickCapture = (event) => {
      if (!suppressClickRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);
    window.addEventListener('click', handleClickCapture, true);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
      window.removeEventListener('click', handleClickCapture, true);
    };
  }, []);

  const handlePointerDown = (event) => {
    if (!is3D || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;

    suppressClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rotationX: rotation.x,
      rotationY: rotation.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleRegionClick = (idx) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onSelect(idx, true);
  };

  return (
    <section id="risco" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="font-serif font-semibold text-[clamp(30px,4.4vw,44px)] leading-tight mb-2">
          Risco na região
        </h2>
        <p className="text-[var(--mu)] text-sm sm:text-base">
          Toque em um ponto do Amazonas para ver o risco e a orientação.
        </p>

        <div className="flex gap-4 justify-center flex-wrap text-xs font-semibold text-[var(--mu)] mt-3">
          <span className="inline-flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-full bg-[var(--natureza)]" /> Baixo (até 15 µg/m³)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-full bg-[#FB8C00]" /> Atenção (15 a 50)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-full bg-[#D32F2F]" /> Perigo (acima de 50)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 relative rounded-3xl border border-[var(--ln)] bg-[var(--sf)] p-4 sm:p-6 overflow-hidden shadow-sm">
          <div className="map-stage relative aspect-[13/10] w-full flex items-center justify-center">
            <div
              className={`map-plane relative w-full h-full ${is3D ? 'is-3d' : ''} ${isDragging ? 'is-dragging' : ''}`}
              style={{ '--map-drag-x': `${rotation.x}deg`, '--map-drag-y': `${rotation.y}deg` }}
              onPointerDown={handlePointerDown}
            >
              <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-full overflow-visible" aria-hidden="true">
                <defs>
                  <filter id="brazil-map-shadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#071510" floodOpacity="0.3" />
                  </filter>
                </defs>
                <g className="brazil-map-side" transform="translate(0 12)">
                  {BRAZIL_STATES.map((state) => (
                    <path key={`side-${state.name}`} d={state.d} fill="var(--map-side)" fillRule="evenodd" />
                  ))}
                </g>
                <g filter="url(#brazil-map-shadow)">
                  {BRAZIL_STATES.map((state, idx) => (
                    <path
                      key={state.name}
                      d={state.d}
                      fill={
                        state.name === 'Amazonas'
                          ? 'var(--map-highlight)'
                          : idx % 2 === 0
                          ? 'var(--map-state)'
                          : 'var(--map-state-alt)'
                      }
                      stroke={state.name === 'Amazonas' ? 'var(--map-highlight-edge)' : 'var(--map-border)'}
                      strokeWidth="1.25"
                      strokeLinejoin="round"
                      fillRule="evenodd"
                    />
                  ))}
                </g>
              </svg>

              <div
                className="map-city-marker"
                style={saoPauloPosition}
                aria-hidden="true"
              >
                <span className="map-city-dot" />
                <span className="map-city-label">São Paulo</span>
              </div>

              {regions.map((r, idx) => {
                const rLevelIdx = r.pm <= 15 ? 0 : r.pm <= 50 ? 1 : 2;
                const rColor = RISK_LEVELS[rLevelIdx].color;
                const isSelected = idx === selectedIdx;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRegionClick(idx)}
                    aria-pressed={isSelected}
                    aria-label={`${r.name}, risco ${RISK_LEVELS[rLevelIdx].label}`}
                    style={{ ...getMapPosition(r.lat, r.lon), transform: is3D ? 'translate(-50%, -50%) translateZ(34px)' : 'translate(-50%, -50%)' }}
                    className={`absolute w-11 h-11 rounded-full grid place-items-center cursor-pointer transition-transform ${
                      isSelected ? 'ring-2 ring-[var(--ink)] scale-110 z-20' : 'z-10 hover:scale-105'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: rColor, boxShadow: `0 0 0 0 ${rColor}` }}
                      className="w-4 h-4 rounded-full pulse-pin block border-2 border-white"
                    />
                    <span
                      className={`map-region-label map-region-label-${r.id}`}
                    >
                      {r.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--ln)] text-xs">
            <span className="text-[var(--mu)] font-medium">
              {is3D ? 'Arraste para girar • Amazonas em destaque' : 'Visão plana • Amazonas em destaque'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIs3D((v) => !v)}
                aria-pressed={is3D}
                title={is3D ? 'Mudar para visão plana' : 'Mudar para visão 3D'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--ln)] bg-[var(--bg)] font-semibold hover:border-[var(--natureza)] transition"
              >
                <Layers className="w-3.5 h-3.5" />
                {is3D ? 'Visão 3D' : 'Visão Plana'}
              </button>
              <button
                type="button"
                onClick={() => onSelect(1, false)}
                title="Centralizar em Lábrea"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[var(--ln)] bg-[var(--bg)] font-semibold hover:border-[var(--natureza)] transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-center rounded-3xl border border-[var(--ln)] bg-[var(--sf)] p-6 text-center shadow-sm" aria-live="polite">
          <h3 className="font-serif font-semibold text-3xl mb-2">{current.name}</h3>

          <svg className="w-56 mx-auto my-2" viewBox="0 0 200 110" aria-hidden="true">
            <path d="M10 100A90 90 0 0 1 190 100" fill="none" stroke="var(--ln)" strokeWidth="16" strokeLinecap="round" />
            <path
              d="M10 100A90 90 0 0 1 190 100"
              fill="none"
              stroke={level.color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={gaugeOffset}
              style={{ transition: 'stroke-dashoffset 0.9s ease, stroke 0.5s ease' }}
            />
          </svg>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              style={{ backgroundColor: level.color }}
              className={`inline-block font-extrabold text-sm px-3.5 py-1 rounded-full ${level.textClass}`}
            >
              {level.label}
            </span>
            <span className="text-sm text-[var(--mu)] font-medium">PM2,5: {Math.round(current.pm)} µg/m³</span>
          </div>

          <p className="text-xs text-[var(--mu)] mb-3">
            {Math.round(current.temp)} °C • umid. {Math.round(current.hum)}% • vento {Math.round(current.wind)} km/h
            {current.hotspots != null ? ` • ${current.hotspots} ${current.hotspots === 1 ? 'foco' : 'focos'} de calor (INPE)` : ''}
          </p>

          <p className="text-sm sm:text-base font-medium leading-relaxed mb-4">{level.advice}</p>

          <button
            type="button"
            onClick={() => onSpeak(`${current.name}: risco ${level.label.toLowerCase()}. ${level.advice}`)}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-[#FB8C00] text-[#1B1F24] font-bold text-sm hover:brightness-105 transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            Ouvir recomendação
          </button>

          {!status.live && !status.loading && (
            <p className="text-xs font-bold text-[var(--erro)] mt-4" role="status">
              Valores de demonstração: não são medições reais.
            </p>
          )}
          <p className="text-[11px] text-[var(--mu)] mt-2 leading-snug">{status.text}</p>
        </div>
      </div>
    </section>
  );
}
