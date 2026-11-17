import { useEffect, useState } from 'react';
import { REGIONS } from '../data/regions';
import { fetchEnvironmentData, fetchInpeHotspots } from '../services/api';

const norm = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase();

// Busca ar/clima (Open-Meteo) e focos de calor (INPE) em paralelo.
// Nunca mistura dado real com inventado: se o INPE falhar, hotspots fica null (não aparece).
// Se a Open-Meteo falhar, os valores de demonstração ficam marcados com live = false.
export function useEnvironmentData() {
  const [regions, setRegions] = useState(REGIONS);
  const [status, setStatus] = useState({
    text: 'Carregando dados ambientais…',
    live: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [envRes, inpeRes] = await Promise.allSettled([
        fetchEnvironmentData(REGIONS),
        fetchInpeHotspots(),
      ]);

      let updated = REGIONS.map((r) => ({ ...r }));
      const parts = [];
      let live = false;

      if (envRes.status === 'fulfilled') {
        const env = envRes.value;
        updated = updated.map((r, i) => ({
          ...r,
          pm: env[i].pm ?? r.pm,
          temp: env[i].temp ?? r.temp,
          hum: env[i].hum ?? r.hum,
          wind: env[i].wind ?? r.wind,
        }));
        live = true;
        const when = env[0].time ? env[0].time.replace('T', ' às ') : 'agora';
        parts.push(`Ar e clima ao vivo: Open-Meteo/CAMS (${when}).`);
      } else {
        parts.push('Valores de demonstração: não foi possível consultar a Open-Meteo agora.');
      }

      if (inpeRes.status === 'fulfilled') {
        const { counts, dateLabel } = inpeRes.value;
        updated = updated.map((r) => ({ ...r, hotspots: counts[norm(r.name)] || 0 }));
        parts.push(`Focos de calor: INPE, dia ${dateLabel}.`);
      } else {
        parts.push('Focos de calor do INPE indisponíveis agora.');
      }

      if (!cancelled) {
        setRegions(updated);
        setStatus({ text: parts.join(' '), live, loading: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { regions, status };
}
