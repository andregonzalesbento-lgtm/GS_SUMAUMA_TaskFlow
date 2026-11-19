export const ESTACAO = {
  id: 'ribeirinha01',
  territorio: 'Comunidade Ribeirinha do Catalão',
  cidade: 'Manaus (AM)',
  placa: 'ESP32 (DevKit C V4)',
  simulador: 'Wokwi',
  projeto: 'SumaUma Edge Computing GS',
  autores: 'Nicholas Franco Vidal (sensor) e Richard Henrique Dias dos Santos (Python)',
};

export const WOKWI_URL = 'https://wokwi.com/projects/480986965992104961';
export const RICHARD_REPO_URL = 'https://github.com/RichardDsant-dev/SUMAUMA_GS';

export const SENSORES = [
  { peca: 'DHT22', mede: 'Temperatura e umidade do ar' },
  { peca: 'MQ-2', mede: 'Fumaça e gases (saída analógica, em %)' },
  { peca: 'Sensor de chama', mede: 'Chama (saída analógica, em %)' },
  { peca: 'HC-SR04', mede: 'Nível do rio (em cm)' },
  { peca: 'LEDs verde, amarelo e vermelho', mede: 'Mostram o estado da estação' },
  { peca: 'Buzzer', mede: 'Alarme sonoro' },
  { peca: 'Botão', mede: 'Simula a falta de internet' },
];

export const LIMIARES = [
  { grandeza: 'Fumaça (MQ-2)', unidade: '%', atencao: 40, alerta: 65, critico: 85 },
  { grandeza: 'Chama', unidade: '%', atencao: 20, alerta: 40, critico: 70 },
  { grandeza: 'Temperatura', unidade: '°C', atencao: 33, alerta: 37, critico: 41 },
  { grandeza: 'Taxa de aquecimento', unidade: '°C/min', atencao: 3, alerta: 6, critico: 10 },
  { grandeza: 'Nível do rio', unidade: 'cm', atencao: 200, alerta: 260, critico: 320, nota: '40 cm ou menos = seca' },
];

export const REGRA_FOGO = [
  'Estados do ESP32: NORMAL, ATENÇÃO, ALERTA e CRÍTICO.',
  'Dois indicadores de fogo ao mesmo tempo: pelo menos ALERTA (incêndio provável).',
  'Três ou mais indicadores: CRÍTICO (incêndio confirmado).',
];

export const TELEMETRIA = [
  'Envia uma leitura a cada 5 segundos ou quando o estado muda.',
  'Usa a média móvel de 4 amostras para evitar picos falsos.',
  'O MQ-2 aquece por 10 segundos antes da primeira leitura.',
  'Sem internet, guarda até 20 leituras numa fila e envia depois.',
];

export const QUALIDADE_AR = [
  { id: 'BOM', label: 'Bom', min: 0 },
  { id: 'MODERADO', label: 'Moderado', min: 40 },
  { id: 'RUIM', label: 'Ruim', min: 65 },
  { id: 'PERIGOSO', label: 'Perigoso', min: 85 },
];

export const MARCAS_FUMACA = [40, 65, 85];

export function qualidadeDoAr(fumacaPct) {
  if (typeof fumacaPct !== 'number' || !Number.isFinite(fumacaPct)) return null;
  let faixa = QUALIDADE_AR[0];
  for (const f of QUALIDADE_AR) if (fumacaPct >= f.min) faixa = f;
  return faixa;
}

export const FLUXO = [
  { etapa: 'ESP32 (Wokwi)', desc: 'Lê os sensores simulados e calcula o estado.' },
  { etapa: 'MQTT (HiveMQ)', desc: 'Leva a telemetria pelo broker.hivemq.com, porta 1883.' },
  { etapa: 'Python', desc: 'Analisa a leitura e decide o nível de alerta.' },
  { etapa: 'API de avisos', desc: 'Recebe o alerta na mesma API REST dos avisos do site.' },
  { etapa: 'Site', desc: 'Mostra a leitura nesta seção e na lista de avisos.' },
];

export const PYTHON_FAZ = [
  'Recebe a telemetria do ESP32 por MQTT.',
  'Cruza a leitura com a Open-Meteo (PM2,5 e vento).',
  'Filtra o "calor extremo" isolado: sem fumaça nem chama, não dispara evacuação.',
  'Calcula alertas geolocalizados pela fórmula de Haversine (3 km para fogo, 8 km para fumaça) para cidadãos fictícios.',
  'Devolve comandos ao ESP32.',
  'Envia o alerta ao site só quando o nível muda.',
];

export const TERRITORIOS = [
  { nome: 'Comunidade Ribeirinha do Catalão', estacao: 'ribeirinha01' },
  { nome: 'Bairro Educandos / Área de Palafitas', estacao: null },
  { nome: 'Comunidade Indígena Parque das Tribos', estacao: null },
];

const NIVEIS = {
  NORMAL: 'Normal',
  'ATENÇÃO': 'Atenção',
  'ALERTA LARANJA': 'Alerta',
  'EMERGENCIA CRITICA': 'Emergência crítica',
};

const ESTADOS = {
  NORMAL: 'Normal',
  ATENCAO: 'Atenção',
  ALERTA: 'Alerta',
  CRITICO: 'Crítico',
};

const MOTIVOS = {
  OK: 'Sem anormalidade',
  INCENDIO_PROVAVEL: 'Incêndio provável',
  CALOR_EXTREMO: 'Calor extremo',
  COMANDO_PYTHON: 'Comando do Python',
};

const CAMPOS = [
  ['ESP32', 'estado', null],
  ['Fumaça', 'fumaca', '%'],
  ['Chama', 'chama', '%'],
  ['Temp', 'temp', '°C'],
  ['Umid', 'umid', '%'],
  ['Rio', 'rio', 'cm'],
  ['PM2.5', 'pm25', 'µg/m³'],
  ['Vento', 'vento', 'km/h'],
];

const CABECALHO = /^\[([^\]]*)\]\s+(.+?)\s+\(([^()]*)\)\s+em\s+(.+)$/;
const DATA = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
const NUMERO = /^(-?\d+(?:\.\d+)?)\s*(\S+)$/;

function rotulo(mapa, valor) {
  if (!valor) return null;
  if (mapa[valor]) return mapa[valor];
  const t = valor.replace(/_/g, ' ').toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function lerNumero(bruto, unidade) {
  const m = NUMERO.exec(bruto);
  if (!m || m[2] !== unidade) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function lerData(bruto) {
  const m = DATA.exec(bruto);
  if (!m) return { texto: null, ts: null };
  const [, dd, mm, aaaa, hh, mi, ss] = m.map(Number);
  const dt = new Date(aaaa, mm - 1, dd, hh, mi, ss);
  if (dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return { texto: null, ts: null };
  return { texto: bruto, ts: dt.getTime() };
}

export function parseAvisoEstacao(d) {
  if (typeof d !== 'string' || d.length > 1000) return null;
  const partes = d.trim().replace(/\.$/, '').split(' | ');
  if (partes.length !== CAMPOS.length + 1) return null;

  const cab = CABECALHO.exec(partes[0]);
  if (!cab) return null;

  const valores = {};
  for (let i = 0; i < CAMPOS.length; i++) {
    const [nome, chave, unidade] = CAMPOS[i];
    const prefixo = `${nome}: `;
    if (!partes[i + 1].startsWith(prefixo)) return null;
    const bruto = partes[i + 1].slice(prefixo.length).trim();
    if (unidade === null) valores[chave] = bruto && bruto !== 'None' ? bruto : null;
    else valores[chave] = bruto === 'sem dado' ? null : lerNumero(bruto, unidade);
  }

  const data = lerData(cab[1].trim());
  const nivel = cab[2].trim();
  const motivo = cab[3].trim();

  return {
    data: data.texto,
    ts: data.ts,
    nivel,
    nivelLabel: rotulo(NIVEIS, nivel),
    motivo: motivo && motivo !== 'None' ? motivo : null,
    motivoLabel: motivo && motivo !== 'None' ? rotulo(MOTIVOS, motivo) : null,
    territorio: cab[4].trim(),
    estado: valores.estado,
    estadoLabel: rotulo(ESTADOS, valores.estado),
    fumaca: valores.fumaca,
    chama: valores.chama,
    temp: valores.temp,
    umid: valores.umid,
    rio: valores.rio,
    pm25: valores.pm25,
    vento: valores.vento,
  };
}

export const EXEMPLO_ILUSTRATIVO = [
  '[] ALERTA LARANJA (INCENDIO_PROVAVEL) em Comunidade Ribeirinha do Catalão | ESP32: ALERTA | Fumaça: 70% | Chama: 45% | Temp: 36.0°C | Umid: 30.0% | Rio: 150.0 cm | PM2.5: 48.0 µg/m³ | Vento: 9.0 km/h.',
  '[] NORMAL (OK) em Comunidade Ribeirinha do Catalão | ESP32: NORMAL | Fumaça: 12% | Chama: 0% | Temp: 30.0°C | Umid: 62.0% | Rio: 150.0 cm | PM2.5: 12.0 µg/m³ | Vento: 5.0 km/h.',
];
