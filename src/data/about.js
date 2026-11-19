import { WOKWI_URL, RICHARD_REPO_URL } from './estacao';

export const PROJECT_ORIGIN =
  'A SumaUma nasceu do desafio CitizenTech da Global Solution 2026.2 da FIAP: criar uma solução de tecnologia cidadã para um problema real. O grupo escolheu as queimadas e a fumaça na Amazônia porque quem vive perto do fogo recebe a informação tarde, de forma dispersa e sem saber se a ajuda chegou.';

export const GROUP = {
  name: 'Grupo TaskFlow, estudantes da FIAP.',
  note: 'Cada integrante conhece o projeto inteiro; as áreas abaixo mostram quem liderou cada parte.',
};

export const MEMBERS = [
  { name: 'André Gonzales Bento', area: 'Front-end Design e Web Development' },
  { name: 'Samuel Kayto Takiuchi', area: 'Front-end Design e Web Development' },
  { name: 'Richard Henrique Dias dos Santos', area: 'Computational Thinking with Python' },
  {
    name: 'Isabella Rodrigues Afonso',
    area: 'Differentiated Problem Solving, Software & Total Experience Design e Storytelling',
  },
  { name: 'Nicholas Franco Vidal', area: 'Edge Computing & Computer Systems' },
];

export const APIS = [
  {
    name: 'Open-Meteo',
    url: 'https://open-meteo.com/',
    desc: 'Qualidade do ar (PM2,5) e clima. Dados CAMS/Copernicus, licença CC BY 4.0.',
  },
  {
    name: 'INPE Queimadas',
    url: 'https://terrabrasilis.dpi.inpe.br/queimadas/portal/',
    desc: 'Focos de calor detectados por satélite.',
  },
  {
    name: 'MockAPI.io',
    url: 'https://mockapi.io/',
    desc: 'Guarda os avisos: criar, consultar, atualizar e excluir.',
  },
  {
    name: 'VLibras',
    url: 'https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras',
    desc: 'Tradução do site para Libras, do Governo Federal.',
  },
];

export const OTHER_RESOURCES = [
  {
    name: 'Estação no Wokwi (ESP32)',
    url: WOKWI_URL,
    desc: 'Simulação do ESP32 com DHT22, MQ-2, sensor de chama e HC-SR04 (Edge Computing).',
  },
  {
    name: 'HiveMQ (MQTT)',
    url: 'https://www.hivemq.com/',
    desc: 'Broker público broker.hivemq.com, que leva a telemetria do ESP32 ao Python.',
  },
  {
    name: 'Python da estação (SUMAUMA_GS)',
    url: RICHARD_REPO_URL,
    desc: 'Analisa a telemetria e envia os alertas à API de avisos. Repositório do Richard.',
  },
  {
    name: 'click_that_hood',
    url: 'https://github.com/codeforamerica/click_that_hood',
    desc: 'Mapa do Brasil (Code for America), licença MIT.',
  },
  {
    name: 'Google Fonts',
    url: 'https://fonts.google.com/',
    desc: 'Fontes Source Serif 4 e IBM Plex Sans.',
  },
];

export const REPO_URL = 'https://github.com/andregonzalesbento-lgtm/GS_SUMAUMA_TaskFlow';
