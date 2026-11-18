import { existsSync, readFileSync } from 'node:fs';

function readEnvUrl() {
  if (process.env.VITE_API_URL) return process.env.VITE_API_URL;
  if (!existsSync('.env')) return '';
  const line = readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith('VITE_API_URL='));
  return line ? line.split('=').slice(1).join('=').trim() : '';
}

const API_URL = readEnvUrl().replace(/\/$/, '');
if (!API_URL) {
  console.error('FALHA: defina VITE_API_URL no .env (veja .env.example).');
  process.exit(1);
}

const headers = { 'Content-Type': 'application/json' };
const results = [];
let createdId = null;

async function step(name, fn) {
  try {
    await fn();
    results.push(true);
    console.log(`OK     ${name}`);
  } catch (err) {
    results.push(false);
    console.log(`FALHA  ${name}: ${err.message}`);
  }
}

function check(condition, message) {
  if (!condition) throw new Error(message);
}

const sample = { k: 0, z: 'TESTE AUTOMÁTICO', d: 'Criado por scripts/test-api.mjs', s: 0, cf: 0 };

await step('POST   cria aviso', async () => {
  const res = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(sample) });
  check(res.ok, `status ${res.status}`);
  const body = await res.json();
  check(body.id, 'resposta sem id');
  createdId = body.id;
});

await step('GET    lista e encontra o aviso', async () => {
  check(createdId, 'nada foi criado');
  const res = await fetch(API_URL);
  check(res.ok, `status ${res.status}`);
  const list = await res.json();
  check(list.some((r) => String(r.id) === String(createdId)), 'aviso não aparece na lista');
});

await step('PUT    avança etapa e confirma', async () => {
  check(createdId, 'nada foi criado');
  const res = await fetch(`${API_URL}/${createdId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ ...sample, s: 1, cf: 1 }),
  });
  check(res.ok, `status ${res.status}`);
  const body = await res.json();
  check(body.s === 1 && body.cf === 1, 'campos não foram atualizados');
});

await step('DELETE apaga o aviso de teste', async () => {
  check(createdId, 'nada foi criado');
  const res = await fetch(`${API_URL}/${createdId}`, { method: 'DELETE' });
  check(res.ok, `status ${res.status}`);
  const list = await (await fetch(API_URL)).json();
  check(!list.some((r) => String(r.id) === String(createdId)), 'aviso ainda aparece na lista');
  createdId = null;
});

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} operações OK`);
if (createdId) console.log(`Atenção: o aviso de teste ${createdId} não foi apagado.`);
process.exit(passed === results.length ? 0 : 1);
