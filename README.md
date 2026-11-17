# SumaUma — Informação que protege a natureza

Protótipo web da **Global Solution 2026.2 (FIAP) — CitizenTech**, feito em React + Vite + Tailwind CSS. Este repositório junta o trabalho de André (estrutura, hooks, integração com APIs, documentação) e de Kayto (mapa do Brasil em relevo, tema de cores e revisão de textos).

## Ficha da CitizenTech

> Itens marcados com **[CONFIRMAR]** dependem de decisão do grupo ou dos professores. Revise antes de entregar.

| Campo | Resposta |
|---|---|
| **Nome da solução** | SumaUma |
| **Cidade e bairro** | Manaus (AM) e municípios do sul do Amazonas (Lábrea, Apuí, Humaitá, Boca do Acre), com apoio a partir de São Paulo. **[CONFIRMAR bairro/comunidade]** |
| **Cidadão beneficiado** | Morador de comunidade ribeirinha ou periférica que convive com fumaça e queimadas e tem pouco sinal de internet. **[CONFIRMAR perfil/pessoa real definida com os professores]** |
| **Problema em uma frase** | Quem vive perto das queimadas na Amazônia recebe a informação sobre fogo e fumaça tarde, de forma dispersa e sem saber se a ajuda chegou. |
| **Como funciona** | O site mostra o risco do ar por município (PM2,5 da Open-Meteo/CAMS e focos de calor do INPE), orienta em linguagem simples (com leitura em voz alta) e permite avisar sobre fogo ou fumaça. O aviso entra numa lista com etapas (enviado → brigada avisada → atendido → confirmado pelo morador) e fica guardado numa fila mesmo sem internet. |
| **O que cada parte faz** | **André:** componentes React, hooks personalizados, integração com Open-Meteo/INPE e CRUD de avisos, notícias, acessibilidade e documentação. **Kayto:** mapa do Brasil em relevo (arrastável), tema de cores claro/escuro, floresta do Hero e revisão dos textos. **[CONFIRMAR divisão e PREENCHER demais integrantes]** |
| **Link do repositório** | **[PREENCHER: link do GitHub privado, com os professores como colaboradores com permissão de escrita]** |
| **Indicador de impacto** | Percentual de avisos que chegam à etapa "Confirmado" e tempo entre "Enviado" e "Atendido". O protótipo já registra essas etapas em cada aviso (campos `s` e `cf`). |
| **ODS conectados** | ODS 3 (Saúde e bem-estar), ODS 13 (Ação contra a mudança global do clima) e ODS 15 (Vida terrestre). |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (testado com Node 24)
- npm (vem junto com o Node)
- Git, para clonar o repositório
- Opcional: uma URL do MockAPI no arquivo `.env` (veja "API REST externa" abaixo). Sem ela, o app funciona salvando os avisos só no navegador.

## Como rodar

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

Os professores confirmaram que o MockAPI conta como API externa.

## Fontes de dados e limites

| Dado | Fonte | Observação |
|---|---|---|
| PM2,5, temperatura, umidade, vento | [Open-Meteo](https://open-meteo.com/) (Air Quality e Forecast), dados CAMS/Copernicus, licença CC BY 4.0 | Atribuição obrigatória (está no rodapé). Valores de modelo, não de estação local. |
| Focos de calor | [INPE Queimadas](https://terrabrasilis.dpi.inpe.br/queimadas/portal/) (CSV diário) | O app lê o arquivo de ontem (ou de anteontem, se o de ontem ainda não saiu) e conta os focos por município do Amazonas. Em 17/11/2026 o servidor respondia com CORS liberado (`Access-Control-Allow-Origin: *`) e o CSV tinha as colunas `municipio` e `estado`. Se o INPE mudar isso, ficar fora do ar ou demorar mais de 8 s, o número de focos simplesmente **não aparece**; o resto do mapa continua. |
| Mapa do Brasil | Limites estaduais simplificados do projeto [click_that_hood](https://github.com/codeforamerica/click_that_hood) (Code for America), licença MIT | Arquivo `src/data/brazilStates.js`; licença em `LICENSES/click-that-hood.txt`. |
| Notícias | 4 reportagens reais em `src/data/news.js` | Títulos, datas e links conferidos em 17/11/2026. Os resumos são do projeto. |

Pontos de honestidade do protótipo:

- Se a Open-Meteo não responder, o mapa mostra valores de demonstração com um aviso vermelho dizendo que **não são medições reais**.
- Os níveis Baixo / Atenção / Perigo seguem um critério simples de PM2,5 (até 15, 15 a 50, acima de 50 µg/m³), inspirado nas diretrizes da OMS. **Não é** o Risco de Fogo oficial do INPE.
- Alertas por WhatsApp/SMS/rádio, campanhas de São Paulo e boletim por e-mail são **simulações de interface**. Nada é enviado de verdade.
- Em emergência, ligue **193** (Bombeiros), **199** (Defesa Civil) ou **0800 61 8080** (Ibama).

## Dados e privacidade

- **Nenhum dado pessoal real** é usado no projeto. O formulário de aviso pede só o tipo, o município e um texto opcional, sem nome, telefone ou localização exata.
- **Os avisos gravados no MockAPI são de teste**, criados pelo grupo para demonstrar o CRUD. Eles não chegam a bombeiros nem à Defesa Civil.
- O campo de e-mail do boletim é uma **simulação**: o texto digitado fica só no navegador de quem usa (localStorage) e não é enviado a lugar nenhum.
- **Origem dos dados:** qualidade do ar e clima vêm da [Open-Meteo](https://open-meteo.com/) (modelo CAMS/Copernicus, CC BY 4.0); focos de calor vêm do [INPE Queimadas](https://terrabrasilis.dpi.inpe.br/queimadas/portal/) (dados públicos); as notícias de `src/data/news.js` são reportagens públicas, cada uma com link para a fonte original. Detalhes na seção "Fontes de dados e limites".

## Estrutura

```
src/
  components/   Header, Hero, RiverStory, Map3D, SaoPauloHelp, NewsRadar,
                ReportForm, BottomDock, SettingsSheet (9 componentes)
  hooks/        useSettings, useSpeech, useScrollY, useActiveSection,
                useEnvironmentData, useReports (6 hooks personalizados)
  services/     api.js (Open-Meteo, INPE e CRUD de avisos)
  data/         regions.js (municípios e textos), news.js (notícias),
                brazilStates.js (limites estaduais do mapa)
```

Lógica (hooks e serviços), dados e interface ficam em camadas separadas. A pasta `LICENSES/` guarda as licenças de terceiros.

## Tecnologias

React 18, Vite 5, Tailwind CSS 3, lucide-react. Acessibilidade: tamanho de letra, alto contraste, tema claro/escuro, redução de movimento, leitura em voz alta, navegação por teclado no painel de ajustes. `src/index.css` guarda os tokens de tema e as animações.

## Uso de IA

Veja [AI.md](./AI.md).
