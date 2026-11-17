export const REGIONS = [
  { id: 'manaus', name: 'Manaus', x: 52, y: 24, lat: -3.12, lon: -60.02, pm: 22, temp: 32, hum: 62, wind: 7, hotspots: 31 },
  { id: 'labrea', name: 'Lábrea', x: 35, y: 42, lat: -7.26, lon: -64.80, pm: 96, temp: 35, hum: 38, wind: 9, hotspots: 118 },
  { id: 'apui', name: 'Apuí', x: 56, y: 41, lat: -7.20, lon: -59.89, pm: 78, temp: 34, hum: 41, wind: 8, hotspots: 87 },
  { id: 'humaita', name: 'Humaitá', x: 43, y: 34, lat: -7.51, lon: -63.02, pm: 44, temp: 33, hum: 50, wind: 7, hotspots: 44 },
  { id: 'boca-do-acre', name: 'Boca do Acre', x: 23, y: 44, lat: -8.75, lon: -67.40, pm: 12, temp: 30, hum: 66, wind: 6, hotspots: 6 },
];

export const RISK_LEVELS = [
  {
    label: 'Baixo',
    color: '#2E7D32',
    textClass: 'text-white',
    advice: 'Ar sem fumaça forte. Evite queimadas e avise os bombeiros se vir fogo.',
  },
  {
    label: 'Atenção',
    color: '#FB8C00',
    textClass: 'text-[#1B1F24]',
    advice: 'Fumaça acima do recomendado. Evite fogo ao ar livre, hidrate-se e acompanhe os alertas.',
  },
  {
    label: 'Perigo',
    color: '#D32F2F',
    textClass: 'text-white',
    advice: 'Fumaça muito alta. Evite fogo; ao ver chamas, ligue 193. Proteja crianças e idosos em local fechado.',
  },
];

export const SP_ACTIONS = [
  {
    id: 'sp-brigadas',
    tag: 'Apoio Direto',
    title: 'Insumos para brigadas',
    desc: 'Campanhas em SP podem enviar máscaras PFF2, bombas costais e isotônicos a brigadas em áreas críticas.',
    cta: 'Apoiar brigadas',
    detail: 'Prioridade: municípios em nível Perigo, como Lábrea e Apuí.',
  },
  {
    id: 'sp-corredor',
    tag: 'Clima Conectado',
    title: 'Alerta de Fumaça no Sudeste',
    desc: 'Ventos podem levar fumaça da Amazônia a SP. O PM2,5 ajuda escolas e hospitais a se preparar.',
    cta: 'Ativar alerta',
    detail: 'Aviso antecipado se os ventos levarem fumaça a SP.',
  },
  {
    id: 'sp-dados',
    tag: 'Transparência',
    title: 'Monitoramento cidadão',
    desc: 'Relatos locais e dados do INPE ajudam a cobrar prevenção e resposta rápida.',
    cta: 'Compartilhar dados',
    detail: 'Boletim do dia: PM2,5 e focos de calor verificados.',
  },
];

export const FALLBACK_NEWS = [
  {
    id: 'n1',
    region: 'Amazônia • INPE',
    title: 'INPE identifica focos de calor no sul do Amazonas',
    summary: 'Dados diários ajudam brigadas e Defesa Civil a priorizar Lábrea e Apuí.',
    source: 'Programa Queimadas / INPE',
    url: 'https://terrabrasilis.dpi.inpe.br/queimadas/portal/',
  },
  {
    id: 'n2',
    region: 'Conexão SP • Saúde',
    title: 'Queimadas afetam a qualidade do ar em São Paulo',
    summary: 'Acompanhe o PM2,5, hidrate-se e umidifique o ambiente.',
    source: 'Agência Brasil / Saúde',
    url: 'https://agenciabrasil.ebc.com.br/',
  },
  {
    id: 'n3',
    region: 'Prevenção • Comunidade',
    title: 'Rádio e SMS ampliam alertas em áreas sem sinal',
    summary: 'Avisos curtos e em áudio ajudam comunidades ribeirinhas.',
    source: 'Defesa Civil / Boletim',
    url: 'https://www.gov.br/mdr/pt-br/assuntos/protecao-e-defesa-civil',
  },
];
