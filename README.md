# SumaUma — Informação que protege a natureza

## Ficha da CitizenTech

| Campo | Conteúdo |
|---|---|
| **Nome** | SumaUma |
| **Cidade e bairro** | Manaus (AM) como região piloto, ampliando para todas as cidades do Amazonas e região; cidade de São Paulo (SP); e comunidades indígenas do Amazonas e de São Paulo. |
| **Cidadão beneficiado** | Povos ribeirinhos, povos indígenas e crianças de Manaus e entorno, além de moradores de São Paulo afetados pela fumaça, que sofrem com cheias, secas, queimadas, fumaça e isolamento e têm pouco acesso a informação e a serviços de saúde. |
| **Problema em uma frase** | Quem vive perto das queimadas na Amazônia recebe a informação sobre fogo e fumaça tarde, de forma dispersa e sem saber se a ajuda chegou. |
| **Como funciona** | O site mostra o risco do ar por município (PM2,5 da Open-Meteo/CAMS e focos de calor do INPE), orienta em linguagem simples (com leitura em voz alta) e permite avisar sobre fogo ou fumaça. O aviso entra numa lista com etapas (enviado → brigada avisada → atendido → confirmado pelo morador) e fica guardado numa fila mesmo sem internet. Uma estação de sensores simulada no Wokwi (ESP32), na Comunidade Ribeirinha do Catalão, em Manaus, manda a telemetria por MQTT a um programa em Python, que publica os alertas na mesma API de avisos e o site mostra a qualidade do ar pelo nível de fumaça. |
| **O que cada parte faz** | **André Gonzales Bento:** Front-end Design + Web Development (Interface e Interação). Componentes React, hooks personalizados, integração com as APIs (Open-Meteo, INPE e CRUD de avisos), notícias, acessibilidade e documentação.<br>**Samuel Kayto Takiuchi (Kayto):** Front-end Design + Web Development (Interface e Interação). Mapa do Brasil em relevo, tema de cores claro/escuro, floresta do Hero e revisão dos textos do site.<br>**Richard Henrique Dias dos Santos:** Computational Thinking with Python (Lógica). Programa em Python que analisa a telemetria da estação e envia os alertas ao site.<br>**Isabella Rodrigues Afonso:** Differentiated Problem Solving (Matemática), Software & Total Experience Design (Experiência) e Storytelling & Inspiração Empreendedora (Pitch).<br>**Nicholas Franco Vidal:** Edge Computing & Computer Systems (Sensor). Estação ESP32 simulada no Wokwi. |
| **Link do repositório** | https://github.com/andregonzalesbento-lgtm/GS_SUMAUMA_TaskFlow |
| **Link do deploy** | https://gs-sumauma-taskflow.vercel.app |
| **Indicador de impacto** | Tempo entre a identificação de uma necessidade e o encaminhamento, e percentual de relatos acompanhados até a resposta. O protótipo já registra as etapas de cada aviso (campos `s` e `cf`). |
| **ODS conectados** | ODS 3 — Saúde e bem-estar (principal); ODS 10 — Redução das desigualdades; ODS 13 — Ação contra a mudança global do clima. |

## Sobre o projeto

Protótipo web da **Global Solution 2026.2 (FIAP) — CitizenTech**, feito em React + Vite + Tailwind CSS. A parte de Front-end Design e Web Development foi feita por André (estrutura, hooks, integração com APIs, documentação) e Kayto (mapa do Brasil em relevo, tema de cores e revisão de textos).

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (testado com Node 24)
- npm (vem junto com o Node)
- Git, para clonar o repositório
- Opcional: uma URL do MockAPI no arquivo `.env` (veja "API REST externa" abaixo). Sem ela, o app funciona salvando os avisos só no navegador.

## Como rodar

**Site publicado:** https://gs-sumauma-taskflow.vercel.app (Vercel; a cada push na `main` sai um deploy novo).

Para rodar no seu computador:

```bash
git clone https://github.com/andregonzalesbento-lgtm/GS_SUMAUMA_TaskFlow.git
cd GS_SUMAUMA_TaskFlow
npm install
cp .env.example .env   # no Windows: copy .env.example .env  (depois preencha VITE_API_URL)
npm run dev            # desenvolvimento em http://localhost:5173
npm run build          # gera a pasta dist/
npm run preview        # testa o build em http://localhost:4173
npm run test:api       # testa o CRUD da API externa
```

Pode ser aberto direto no VS Code (terminal integrado: `Ctrl + '`).

## API REST externa (CRUD dos avisos)

Os avisos usam uma API REST. Para ligar na nuvem:

1. Crie uma conta em [mockapi.io](https://mockapi.io) e um projeto.
2. Crie o recurso **`avisos`** com os campos: `k` (número), `z` (texto), `d` (texto), `s` (número), `cf` (número).
3. Copie `.env.example` para `.env` e preencha:
   ```
   VITE_API_URL=https://SEU_ID.mockapi.io/api/v1/avisos
   ```
4. No deploy (Vercel/Netlify), cadastre a mesma variável `VITE_API_URL` nas configurações do projeto.

Sem `VITE_API_URL`, o app funciona salvando os avisos só no navegador do aparelho (localStorage). Operações: `GET` (listar), `POST` (criar), `PUT` (atualizar etapa/confirmação) e `DELETE` (excluir).

Para testar o CRUD sem abrir o site, rode `npm run test:api`: o script faz `POST`, `GET`, `PUT` e `DELETE` na URL do `.env`, mostra OK/FALHA de cada operação e apaga o aviso de teste.

## Estação de sensores (Edge Computing + Python)

A seção "Estação de sensores" do site mostra os alertas de uma estação **simulada no Wokwi**. Os valores **não são medições do mundo real**.

- **Estação:** `ribeirinha01`, que representa a Comunidade Ribeirinha do Catalão, em Manaus (AM).
- **Placa:** ESP32 (DevKit C V4) no simulador Wokwi, projeto [SumaUma Edge Computing GS](https://wokwi.com/projects/480986965992104961) (Nicholas).
- **Python:** [RichardDsant-dev/SUMAUMA_GS](https://github.com/RichardDsant-dev/SUMAUMA_GS) (Richard).

**Fluxo:** ESP32 (Wokwi) → MQTT (`broker.hivemq.com`, porta 1883) → Python → API de avisos → site.

O ESP32 envia uma leitura a cada 5 s ou quando o estado muda, com média móvel de 4 amostras. O MQ-2 aquece por 10 s antes da primeira leitura, e sem internet a placa guarda até 20 leituras numa fila.

O Python:

- recebe a telemetria por MQTT;
- cruza com a Open-Meteo (PM2,5 e vento);
- filtra o "calor extremo" isolado, que sem fumaça nem chama não dispara evacuação;
- calcula alertas geolocalizados pela fórmula de Haversine (3 km para fogo e 8 km para fumaça) para cidadãos fictícios;
- devolve comandos ao ESP32;
- quando o nível muda, faz um `POST` na **mesma API REST de avisos** do site, no formato `{k, z, d, s, cf}`: `k` é 0 (fumaça) ou 2 (fogo na mata), `z` é "Manaus", `d` é um texto com os valores e `s` e `cf` são 0.

Não há API nem variável de ambiente nova. O site lê os avisos que já carrega, reconhece os da estação pelo formato do texto `d` (`parseAvisoEstacao` em `src/data/estacao.js`) e os marca na lista com a etiqueta "Estação (simulada)". Se ainda não houver nenhum alerta da estação na API, a seção mostra um **exemplo ilustrativo**, sempre com o aviso "Exemplo ilustrativo: nenhuma leitura da estação recebida ainda.". Leitura recebida e exemplo nunca aparecem juntos.

| Peça simulada | O que faz |
|---|---|
| DHT22 | Temperatura e umidade do ar |
| MQ-2 | Fumaça e gases (saída analógica, em %) |
| Sensor de chama | Chama (saída analógica, em %) |
| HC-SR04 | Nível do rio (em cm) |
| LEDs verde, amarelo e vermelho | Mostram o estado da estação |
| Buzzer | Alarme sonoro |
| Botão | Simula a falta de internet |

| Leitura | Atenção | Alerta | Crítico |
|---|---|---|---|
| Fumaça (MQ-2) | 40 % | 65 % | 85 % |
| Chama | 20 % | 40 % | 70 % |
| Temperatura | 33 °C | 37 °C | 41 °C |
| Taxa de aquecimento | 3 °C/min | 6 °C/min | 10 °C/min |
| Nível do rio (40 cm ou menos = seca) | 200 cm | 260 cm | 320 cm |

Estados do ESP32: NORMAL, ATENÇÃO, ALERTA e CRÍTICO. Dois indicadores de fogo ao mesmo tempo levam a pelo menos ALERTA (incêndio provável); três ou mais, a CRÍTICO (incêndio confirmado).

**Qualidade do ar (nível de fumaça)**, pelo percentual do MQ-2, como no código do ESP32:

| Faixa | Fumaça |
|---|---|
| Bom | abaixo de 40 % |
| Moderado | a partir de 40 % |
| Ruim | a partir de 65 % |
| Perigoso | a partir de 85 % |

O percentual é um índice do sensor simulado, que reage a fumaça e gases. **Não é um índice oficial** de qualidade do ar.

Os territórios "Bairro Educandos / Área de Palafitas" e "Comunidade Indígena Parque das Tribos" já estão cadastrados no Python, mas ainda não têm estação.

## Fontes de dados e limites

| Dado | Fonte | Observação |
|---|---|---|
| PM2,5, temperatura, umidade, vento | [Open-Meteo](https://open-meteo.com/) (Air Quality e Forecast), dados CAMS/Copernicus, licença CC BY 4.0 | Atribuição obrigatória (está no rodapé). Valores de modelo, não de estação local. |
| Focos de calor | [INPE Queimadas](https://terrabrasilis.dpi.inpe.br/queimadas/portal/) (CSV diário) | O app lê o arquivo de ontem (ou de anteontem, se o de ontem ainda não saiu) e conta os focos por município do Amazonas. Em 17/11/2026 o servidor respondia com CORS liberado (`Access-Control-Allow-Origin: *`) e o CSV tinha as colunas `municipio` e `estado`. Se o INPE mudar isso, ficar fora do ar ou demorar mais de 8 s, o número de focos simplesmente **não aparece**; o resto do mapa continua. |
| Mapa do Brasil | Limites estaduais simplificados do projeto [click_that_hood](https://github.com/codeforamerica/click_that_hood) (Code for America), licença MIT | Arquivo `src/data/brazilStates.js`; licença em `LICENSES/click-that-hood.txt`. |
| Notícias | 4 reportagens reais em `src/data/news.js` | Títulos, datas e links conferidos em 17/11/2026. Os resumos são do projeto. |
| Estação de sensores | ESP32 simulado no [Wokwi](https://wokwi.com/projects/480986965992104961) e Python do [SUMAUMA_GS](https://github.com/RichardDsant-dev/SUMAUMA_GS), pela API de avisos | **Simulação**, não medição do mundo real. Detalhes na seção "Estação de sensores". |
| Tradução para Libras | [VLibras](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras), serviço do Governo Federal, carregado de `vlibras.gov.br` | Tradução automática; **não substitui um intérprete humano**. O script é carregado sem bloquear a página e, se o serviço estiver fora do ar ou bloqueado, o botão simplesmente não aparece. |

Pontos de honestidade do protótipo:

- Se a Open-Meteo não responder, o mapa mostra valores de demonstração com um aviso vermelho dizendo que **não são medições reais**.
- Os níveis Baixo / Atenção / Perigo seguem um critério simples de PM2,5 (até 15, 15 a 50, acima de 50 µg/m³), inspirado nas diretrizes da OMS. **Não é** o Risco de Fogo oficial do INPE.
- A estação de sensores é uma **simulação no Wokwi**. Sem alertas dela na API, a seção mostra um exemplo ilustrativo com aviso permanente.
- Alertas por WhatsApp/SMS/rádio, campanhas de São Paulo e boletim por e-mail são **simulações de interface**. Nada é enviado de verdade.
- Em emergência, ligue **193** (Bombeiros), **199** (Defesa Civil) ou **0800 61 8080** (Ibama).

## Dados e privacidade

- **Nenhum dado pessoal real** é usado no projeto. O formulário de aviso pede só o tipo, o município e um texto opcional, sem nome, telefone ou localização exata.
- **Os avisos gravados no MockAPI são de teste**, criados pelo grupo para demonstrar o CRUD. Eles não chegam a bombeiros nem à Defesa Civil.
- A URL da API fica visível no navegador, porque o front-end chama o MockAPI direto. Por isso a API guarda só avisos de teste, sem dado pessoal. O arquivo `.env` real não é versionado; o repositório tem só o `.env.example`, com a variável vazia.
- Os **dados da estação de sensores são simulados** no Wokwi. Os cidadãos que recebem alertas no Python são **fictícios**, e o site não mostra nenhum nome nem telefone deles. Os alertas da estação na API não têm nenhum dado pessoal.
- O **VLibras** é um serviço externo do Governo Federal, carregado de `vlibras.gov.br`. O site funciona normalmente sem ele, e o formulário de avisos não envia dados pessoais a ninguém.
- O campo de e-mail do boletim é uma **simulação**: o texto digitado fica só no navegador de quem usa (localStorage) e não é enviado a lugar nenhum.
- **Origem dos dados:** qualidade do ar e clima vêm da [Open-Meteo](https://open-meteo.com/) (modelo CAMS/Copernicus, CC BY 4.0); focos de calor vêm do [INPE Queimadas](https://terrabrasilis.dpi.inpe.br/queimadas/portal/) (dados públicos); as notícias de `src/data/news.js` são reportagens públicas, cada uma com link para a fonte original. Detalhes na seção "Fontes de dados e limites".

## Estrutura

```
src/
  components/   Header, Hero, RiverStory, Map3D, EstacaoSensor, SaoPauloHelp,
                NewsRadar, ReportForm, Footer, BottomDock, SettingsSheet
                (11 componentes)
  hooks/        useSettings, useSpeech, useScrollY, useActiveSection,
                useEnvironmentData, useReports, useEstacao (7 hooks personalizados)
  services/     api.js (Open-Meteo, INPE e CRUD de avisos)
  data/         regions.js (municípios e textos), news.js (notícias),
                estacao.js (estação de sensores e leitor dos alertas do Python),
                about.js (textos do rodapé, participantes e APIs),
                brazilStates.js (limites estaduais do mapa)
```

O widget VLibras é carregado no `index.html`, fora do `#root`, para o React não remontá-lo.

Lógica (hooks e serviços), dados e interface ficam em camadas separadas. A pasta `LICENSES/` guarda as licenças de terceiros.

## Tecnologias

React 18, Vite 5, Tailwind CSS 3, lucide-react.

Acessibilidade:

- tradução para Libras com o VLibras;
- link "Pular para o conteúdo", que aparece ao usar o teclado;
- anel de foco visível em links, botões e chaves, nos dois temas;
- tamanho de letra, alto contraste, tema claro/escuro, redução de movimento e leitura em voz alta;
- navegação por teclado no painel de ajustes, com o foco devolvido ao fechar.

`src/index.css` guarda os tokens de tema e as animações.

## Uso de IA

Veja [AI.md](./AI.md).
