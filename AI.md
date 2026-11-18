# AI.md — Uso de Inteligência Artificial

Projeto **SumaUma** (Global Solution 2026.2, FIAP — CitizenTech), disciplinas de **Front-end Design + Web Development**.
Este registro documenta as interações de IA do André no projeto; os demais integrantes podem acrescentar as suas depois.

## 1. Ferramentas utilizadas

| Ferramenta | Onde foi usada | Para quê |
|---|---|---|
| Claude (Anthropic) | Chat e sessão de código do Claude | Ideias de seções e design, revisão do código, refatoração da lógica em hooks personalizados, mesclagem do código do Kayto com o do André, verificação das notícias e documentação |
| Claude Code (Anthropic) | Extensão do VS Code, dentro deste repositório | Teste do CRUD da API, teste da interface no navegador, correções de contraste, ajustes de desempenho, VLibras, rodapé, barra inferior, README, AI.md e commits |

O André não usou nenhuma outra ferramenta de IA no projeto.

## 2. Interações realizadas

Exemplos representativos. Os prompts estão transcritos como foram enviados.

| Nº | Prompt enviado (como escrito) | Resposta obtida |
|---|---|---|
| 1 | "faça uma trilha como se fosse um rio se movimentando bem suavemente e esse texto eu já não curti muito refaça o design ou você acha que é nada a ver nessa parte se não penso outra coisa ou vc tem mais ideia" | O Claude propôs a seção "O aviso segue o rio": uma trilha em SVG que preenche conforme a rolagem, ligando quatro etapas. |
| 2 | "com base nessa primeira imagem eu quero que ela desça e suba junto com a montanha, mas sem destoar muito quero algo mais lento e sutil para dar leveza ao site, sobre as fontes quero uma fonte mais séria e condizente com o trabalho em si" | Parallax lento nas montanhas do Hero e troca da tipografia para Source Serif 4 + IBM Plex Sans. |
| 3 | "o movimento acompanhasse a rolagem da página (parallax) e a fonte está melhor, quero que busque essas informações e deixe o projeto mais real entra também no uso da API correto?" | Integração com a Open-Meteo (PM2,5 e clima) e com o INPE (focos de calor), e CRUD de avisos. |
| 4 | "claude tenho esse zip vc consegue ler, dei um upgrade no projeto consegue ver?" | O Claude leu o código e apontou problemas: sem hooks personalizados, notícias não verificadas, classes Tailwind inválidas e dados reais misturados com dados de demonstração. |
| 5 | "faça todas essas substituições incluindo as coisas que faltam e trocando a imagem pela que eu te mandei no lugar dessa inventado e sobre as links de noticias troque para mim por verdadeiros eu creio que seja verdadeiro sim as manchetes mas verifique" | O Claude não conseguiu confirmar as 3 manchetes originais e as substituiu por 4 reportagens reais conferidas. Também criou os 6 hooks, a API com `VITE_API_URL` e a documentação. |
| 6 | "Junte com esse codigo aqui, eu quero que junte eesse zip sobreponto o antigo, mas de uma forma mesclando e substituindo sabe? quero tudo junto em uma coisa pq tinha parte minha junto com a dele" | O Claude mesclou o código do Kayto com o do André por comparação de três vias (as duas versões e o projeto original como base) e resolveu os conflitos arquivo por arquivo. |
| 7 | "pense em como poderiamos ser mais inclusivos meu professor de Web deu a ideia de usarmos isso aqui: https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras para adcionar libras ao nosso site, seria muito bacana, queria deixar o link do github do projeto tambem em algum canto, nossos nomes tambem em colaaboradores sabe que fica no fim da pagina de todo site, tipo um com APIs utilizadas, participantes, sobre o grupo, de onde surgiiu a ideia, link para o github do projeto" | O Claude integrou o widget VLibras e criou o rodapé com APIs, participantes, sobre o grupo, origem da ideia e link do GitHub. |
| 8 | "outras duas coisas eu queria ddeixar o botão da home bar mais bonito esteticamente consegue para mim? e com base nesse print eu queria que voce ajustasse ele para dois modos ou tirasse essa informação ou solucionasse esse problema, pode ser? estou falando sobre esse nenhum canal escolhido" | Redesenho da barra inferior com os tokens do tema e separação em dois estados da mensagem de canais. |
| 9 | "faça o seguinte analise como ficou no github as pastas se subiu alguma que exponha chaves de api etc algo assim mais drastico que desconte nota, faça os ajustes que voce julga necessario, dentro desse prompt faça tambem algo, preciso que voce tire todas as "mensagens" que voce deixa em forma de comentario dentro do codigo" | Auditoria do repositório (nenhum segredo encontrado) e remoção dos comentários do código. |

## 3. Aplicação no projeto

| Arquivo | O que a IA fez |
|---|---|
| `src/hooks/` (6 hooks) | Criou `useSettings`, `useSpeech`, `useScrollY`, `useActiveSection`, `useEnvironmentData` e `useReports`, tirando estado e lógica de negócio dos componentes visuais. |
| `src/components/RiverStory.jsx` | Propôs a seção "O aviso segue o rio". Depois, corrigiu os pontos da trilha para usar medidas reais dos textos com `ResizeObserver`. |
| `src/components/NewsRadar.jsx` e `src/data/news.js` | Trocou as manchetes não confirmadas por 4 reportagens reais, com link direto e data de checagem. |
| `src/services/api.js` | Escreveu o acesso à Open-Meteo, ao CSV diário do INPE e ao CRUD de avisos, com URL em `VITE_API_URL`, tempo limite e tratamento de erros. |
| `src/components/Hero.jsx` | Fez o parallax lento das montanhas e corrigiu ouvintes de eventos que ficavam ativos sem necessidade. |
| `src/components/SettingsSheet.jsx` | Devolve o foco ao botão que abriu o painel quando ele fecha (acessibilidade por teclado). |
| Mesclagem com o código do Kayto | Juntou as duas versões mantendo o mapa, o tema e a floresta do Kayto e os hooks, a API e as notícias do André. |
| `scripts/test-api.mjs` | Script `npm run test:api`, que faz POST, GET, PUT e DELETE na API e apaga o que criou (Claude Code). |
| `src/index.css` e componentes | Tokens `--erro`, `--campo` e `--natureza-texto` para atingir o contraste mínimo nos dois temas, e `<main>` em `App.jsx` (Claude Code). |
| `public/logo.webp` e `index.html` | Logo reduzido para 96 × 96 px e pré-conexão com as fontes (Claude Code). |
| `index.html` (VLibras) | Integração do widget VLibras fora do `#root`, carregado sem bloquear a página, escondido enquanto o painel "Do seu jeito" está aberto (Claude Code). |
| `src/components/Footer.jsx` e `src/data/about.js` | Rodapé com origem da ideia, grupo, participantes, APIs, outros recursos e link do GitHub; os textos ficam em `about.js` (Claude Code). |
| `src/components/BottomDock.jsx` | Redesenho da barra inferior com os tokens do tema, item ativo marcado com `aria-current` e botão Avisar em destaque (Claude Code). |
| `src/components/SettingsSheet.jsx` | Dois estados para a caixa de canais (com e sem canal), anunciados por leitor de tela (Claude Code). |
| `src/App.jsx` e `src/index.css` | Link "Pular para o conteúdo" e anel de foco visível nos dois temas (Claude Code). |
| `README.md` e `AI.md` | Redação e revisão dos textos, a partir das decisões do grupo. |

**Decisões humanas** (não foram da IA):

- o tema (queimadas e qualidade do ar na Amazônia, com apoio de São Paulo) e o nome SumaUma;
- a paleta de cores, o tema claro/escuro e o logo;
- os textos finais do site;
- a escolha das notícias que entram no site;
- a divisão de tarefas do grupo;
- a ideia de usar o VLibras, que veio do professor de Web Development;
- o conteúdo do rodapé e a escolha de mostrar os nomes dos integrantes.

## 4. Validação das respostas

O que foi de fato conferido, e não apenas aceito:

| O que | Como | Resultado |
|---|---|---|
| Compilação | `npm run build` antes de cada commit feito com o Claude Code | Sem erros |
| API externa (MockAPI) | `npm run test:api` em 17/11/2026 | 4/4 operações OK (POST, GET, PUT, DELETE); recurso vazio no fim |
| Open-Meteo e INPE | Requisição com cabeçalho `Origin`, como o navegador faz, em 17/11/2026 | Os dois responderam com CORS liberado. O CSV do INPE tinha as colunas `municipio` e `estado` e 394 focos no Amazonas no dia anterior |
| Contraste | Fórmula da WCAG calculada por script, nos dois temas | Erro: de 2,96 para 6,45 no tema escuro. Bordas de campo: de 1,93 para 3,27 no tema claro. Verde de texto: de 2,87 para 6,23 no tema escuro |
| Lighthouse | Build local, 17/11/2026 | Acessibilidade 100, Boas práticas 100, Desempenho 77 |
| Notícias | Cada uma das 4 páginas foi aberta e título, data e conteúdo foram comparados com `src/data/news.js` | Conferidas em 17/11/2026 |
| Interface com a API real | Teste automático com Playwright no Chrome, tela de 390 px, contra o build local ligado ao MockAPI | 11/11 verificações OK: frase "Aviso salvo no servidor.", envio do aviso, duas vezes "Simular etapa", "Confirmar atendimento", "Excluir", sem erros no console e API vazia no fim |
| VLibras e teclado (18/11/2026) | Playwright no Chrome, telas de 390 px e 1280 px, temas claro e escuro e alto contraste | Botão do VLibras presente e sem cobrir a barra inferior nem o Avisar; escondido com o painel aberto; "Pular para o conteúdo" leva o foco ao `<main>`; anel de foco de 3 px em links e chaves |
| VLibras fora do ar (18/11/2026) | Mesmo teste com `vlibras.gov.br` bloqueado | Aviso enviado e excluído normalmente, nenhuma exceção de JavaScript, nenhum resto do widget na página |
| Rodapé, barra e painel (18/11/2026) | Capturas e medidas automáticas nas mesmas telas e temas | Contraste mínimo de texto medido no navegador: rodapé 6,23:1 e painel 5,13:1; barra 4,68:1 no pior caso calculado (tema escuro sobre área clara); alvos de toque da barra de 62 × 52 px e rótulos de 11 px; fim do rodapé 29 px acima da barra; textos do painel com 14 px |
| Lighthouse com o VLibras (18/11/2026) | Build local, modo celular | Acessibilidade 100, Boas práticas 96, Desempenho 77. Os 4 pontos a menos em Boas práticas vêm de uma imagem interna do próprio widget VLibras |

**Ainda não testado:** celular físico, leitores de tela e o site publicado (deploy).

## 5. Análise crítica

**Onde a IA errou e o que foi feito:**

| Erro | O que o grupo fez |
|---|---|
| A primeira versão tinha 3 manchetes atribuídas a INPE, Agência Brasil e Defesa Civil, com links genéricos. Não foi possível confirmá-las. | Foram removidas e trocadas por 4 reportagens reais, com link direto e data de checagem. |
| Dados reais misturados com dados de demonstração: o mapa mostrava focos de calor inventados quando o INPE falhava. | Agora, sem resposta do INPE, o número não aparece. Quando o ar usa valores de demonstração, há um aviso na tela. |
| Plural errado: "1 focos de calor". | Corrigido para "1 foco". |
| O verde de texto e o vermelho de erro não tinham contraste suficiente no tema escuro (2,87 e 2,96, quando o mínimo é 4,5). | Criados tokens próprios para texto, com contraste acima de 6. |
| Classes Tailwind inválidas, que o Tailwind ignorava em silêncio. | Foram corrigidas. As duas últimas, com opacidade sobre `var()` em `SaoPauloHelp.jsx`, passaram a usar `color-mix()` com as variáveis do tema, com contraste conferido nos dois temas (acima de 5,6:1). |
| O teste da API supôs que o MockAPI responderia 404 depois de excluir um aviso, mas ele responde 500. | O teste passou a conferir se o aviso sumiu da lista, em vez de depender do código de resposta. |
| A trilha do rio posicionava os pontos por divisão igual da altura, e não pela posição real dos textos. | Passou a usar medidas reais com `ResizeObserver`. |

**Riscos que continuam:**

- A IA escreve com segurança coisas que não são verdade. Todo dado factual precisa de conferência humana.
- O protótipo não tem autenticação nem proteção contra abuso na API; em produção seria preciso um back-end intermediário entre o site e o banco de avisos.
- É um protótipo. Os avisos não chegam a bombeiros reais, e botões de São Paulo, canais WhatsApp/SMS/rádio e boletim são simulações de interface.
- Quando a Open-Meteo não responde, o mapa usa dados de demonstração, sempre indicados na tela.
- Os níveis Baixo / Atenção / Perigo seguem um critério simples de PM2,5. Não são o Risco de Fogo oficial do INPE.
- O formulário que orientou a escolha do tema teve 63 respostas, a maioria de pessoas de grande cidade e nenhuma da Amazônia. Ele mede o apoio à ideia, não a necessidade de quem vive o problema. A validação com moradores e agentes de saúde continua pendente.
