export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url, options = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

function norm(s) {
  return String(s || '')
    .replace(/"/g, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .trim();
}

export async function fetchEnvironmentData(regions) {
  const latList = regions.map((r) => r.lat).join(',');
  const lonList = regions.map((r) => r.lon).join(',');
  const query = `latitude=${latList}&longitude=${lonList}&timezone=auto`;

  const [airRes, weatherRes] = await Promise.all([
    fetchWithTimeout(`https://air-quality-api.open-meteo.com/v1/air-quality?${query}&current=pm2_5`),
    fetchWithTimeout(
      `https://api.open-meteo.com/v1/forecast?${query}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
    ),
  ]);

  if (!airRes.ok || !weatherRes.ok) throw new Error('Falha ao consultar Open-Meteo');

  const airData = await airRes.json();
  const weatherData = await weatherRes.json();

  return regions.map((r, i) => {
    const a = (Array.isArray(airData) ? airData[i] : airData)?.current ?? {};
    const w = (Array.isArray(weatherData) ? weatherData[i] : weatherData)?.current ?? {};
    return {
      pm: a.pm2_5 ?? null,
      temp: w.temperature_2m ?? null,
      hum: w.relative_humidity_2m ?? null,
      wind: w.wind_speed_10m ?? null,
      time: w.time ?? a.time ?? '',
    };
  });
}

function stampDaysAgo(days) {
  const d = new Date(Date.now() - days * 864e5);
  return (
    d.getUTCFullYear() + ('0' + (d.getUTCMonth() + 1)).slice(-2) + ('0' + d.getUTCDate()).slice(-2)
  );
}

async function fetchInpeFor(stamp) {
  const res = await fetchWithTimeout(
    `https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/focos_diario_br_${stamp}.csv`
  );
  if (!res.ok) throw new Error('INPE indisponível');

  const lines = (await res.text()).split('\n');
  const header = lines[0].toLowerCase().replace(/"/g, '').split(',');
  const im = header.indexOf('municipio');
  const ie = header.indexOf('estado');
  if (im < 0 || ie < 0) throw new Error('Colunas inválidas no CSV do INPE');

  const counts = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (norm(cols[ie]) === 'AMAZONAS') {
      const m = norm(cols[im]);
      counts[m] = (counts[m] || 0) + 1;
    }
  }
  return { counts, dateLabel: `${stamp.slice(6)}/${stamp.slice(4, 6)}` };
}

export async function fetchInpeHotspots() {
  try {
    return await fetchInpeFor(stampDaysAgo(1));
  } catch {
    return fetchInpeFor(stampDaysAgo(2));
  }
}

const LOCAL_KEY = 'suma_reports_v2';

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeLocal(list) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
}

const jsonHeaders = { 'Content-Type': 'application/json' };

export const reportsApi = {
  async list() {
    if (API_URL) {
      const res = await fetchWithTimeout(API_URL);
      if (!res.ok) throw new Error(`GET ${res.status}`);
      return res.json();
    }
    return readLocal();
  },
  async create(report) {
    if (API_URL) {
      const res = await fetchWithTimeout(API_URL, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error(`POST ${res.status}`);
      return res.json();
    }
    const item = { ...report, id: String(Date.now()) };
    writeLocal([item, ...readLocal()]);
    return item;
  },
  async update(id, report) {
    if (API_URL) {
      const res = await fetchWithTimeout(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error(`PUT ${res.status}`);
      return res.json();
    }
    writeLocal(readLocal().map((r) => (String(r.id) === String(id) ? report : r)));
    return report;
  },
  async remove(id) {
    if (API_URL) {
      const res = await fetchWithTimeout(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`DELETE ${res.status}`);
      return;
    }
    writeLocal(readLocal().filter((r) => String(r.id) !== String(id)));
  },
};
