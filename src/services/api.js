import { FALLBACK_NEWS } from '../data/regions';

// Cole aqui a URL do recurso "avisos" da sua API REST (ex.: MockAPI.io). Vazio = salva localmente no aparelho.
export const API_URL = '';

function norm(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
}

function shortenNewsSummary(description) {
  const text = String(description || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (text.length <= 100) return text || 'Sem resumo disponível.';
  const end = text.lastIndexOf(' ', 100);
  return `${text.slice(0, end > 0 ? end : 100)}…`;
}

export async function fetchEnvironmentData(regions) {
  const latList = regions.map((r) => r.lat).join(',');
  const lonList = regions.map((r) => r.lon).join(',');
  const query = `latitude=${latList}&longitude=${lonList}&timezone=auto`;

  const [airRes, weatherRes] = await Promise.all([
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${query}&current=pm2_5`),
    fetch(`https://api.open-meteo.com/v1/forecast?${query}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`),
  ]);

  if (!airRes.ok || !weatherRes.ok) throw new Error('Falha ao consultar Open-Meteo');

  const airData = await airRes.json();
  const weatherData = await weatherRes.json();

  return regions.map((r, i) => {
    const a = Array.isArray(airData) ? airData[i].current : airData.current;
    const w = Array.isArray(weatherData) ? weatherData[i].current : weatherData.current;
    return {
      pm: a.pm2_5,
      temp: w.temperature_2m,
      hum: w.relative_humidity_2m,
      wind: w.wind_speed_10m,
      time: w.time,
    };
  });
}

export async function fetchInpeHotspots() {
  const d = new Date(Date.now() - 864e5);
  const stamp =
    d.getUTCFullYear() +
    ('0' + (d.getUTCMonth() + 1)).slice(-2) +
    ('0' + d.getUTCDate()).slice(-2);

  const res = await fetch(
    `https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/focos_diario_br_${stamp}.csv`
  );
  if (!res.ok) throw new Error('INPE indisponível');

  const text = await res.text();
  const lines = text.split('\n');
  const header = lines[0].toLowerCase().split(',');
  const im = header.indexOf('municipio');
  const ie = header.indexOf('estado');
  if (im < 0 || ie < 0) throw new Error('Colunas inválidas');

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

export async function fetchVerifiedNews() {
  try {
    const rssUrl = encodeURIComponent('https://agenciabrasil.ebc.com.br/rss/meio-ambiente/feed.xml');
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    if (!res.ok) throw new Error('RSS indisponível');
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('Sem itens');
    }
    return data.items.slice(0, 3).map((item, idx) => ({
      id: item.guid || `rss-${idx}`,
      region: 'Agência Brasil • Meio Ambiente',
      title: item.title,
      summary: shortenNewsSummary(item.description),
      source: 'Agência Brasil (EBC)',
      url: item.link,
    }));
  } catch {
    return FALLBACK_NEWS;
  }
}

const LOCAL_KEY = 'suma_reports_v2';

export const reportsApi = {
  async list() {
    if (API_URL) {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Erro GET');
      return res.json();
    }
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    } catch {
      return [];
    }
  },
  async create(report) {
    if (API_URL) {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error('Erro POST');
      return res.json();
    }
    const list = await this.list();
    const item = { ...report, id: String(Date.now()) };
    const next = [item, ...list];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    return item;
  },
  async update(id, report) {
    if (API_URL) {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error('Erro PUT');
      return res.json();
    }
    const list = await this.list();
    const next = list.map((r) => (String(r.id) === String(id) ? report : r));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    return report;
  },
  async remove(id) {
    if (API_URL) {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro DELETE');
      return;
    }
    const list = await this.list();
    const next = list.filter((r) => String(r.id) !== String(id));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  },
};
