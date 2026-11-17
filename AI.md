# AI.md — Uso de Inteligência Artificial

Documento sobre como a IA foi usada na parte de **Front-end Design + Web Development** do SumaUma.

> **Antes de entregar:** este texto foi montado a partir do histórico real das conversas com o Claude (Anthropic). Leia, corrija o que não corresponde ao que você fez e acrescente interações que aconteceram fora dessas conversas. Não deixe nada que você não tenha realmente feito.

## Ferramenta

Claude (Anthropic), em conversas com o André ao longo do projeto. Nessas conversas o Claude também fez pesquisas na web.

## Interações principais

| # | O que foi pedido | O que a IA fez | O que o grupo/André decidiu |
|---|---|---|---|
| 1 | Melhorar 5 ideias e propor novas | Sugeriu variações e ideias novas | O grupo escolheu o rumo a partir de um formulário próprio (63 respostas) |
| 2 | Formulário para perguntar ao público | Redigiu perguntas dinâmicas e o texto de divulgação | Aplicado pelo grupo; as respostas são reais |
| 3 | Analisar os resultados e fazer um dashboard | Contou e organizou as respostas e gerou uma página de gráficos | O grupo decidiu o tema; limites da amostra (maioria urbana) foram registrados |
| 4 | Ler os PDFs do projeto e do desafio e montar escopo | Resumiu requisitos e propôs o escopo de Front/Web | André definiu que o foco da sua parte é Front e Web |
| 5 | Pesquisar sites parecidos | Comparou o que há de bom e ruim em plataformas semelhantes | Pontos aproveitados no design (simplicidade, alerta claro, aviso com status) |
| 6 | Protótipo visual com paleta, rio, mapa, dock inferior | Gerou versões em HTML/CSS/JS a partir das referências do André | André escolheu fontes, paleta e ajustou o layout em várias rodadas |
| 7 | Revisão do projeto React do André | Leu o código, apontou problemas e aplicou as correções (hooks, notícias, API, acessibilidade) | André pediu as correções e trocou a imagem pela logo dele |
| 8 | Juntar o código do Kayto com o do André | Comparou as duas versões com o projeto original como base, mesclou arquivo por arquivo e resolveu os conflitos de texto e estilo | André pediu a junção; os dois definiram o que fica (mapa, tema e floresta do Kayto; hooks e notícias reais do André) |

## Como o resultado foi validado

- **Compilação:** `npm run build` sem erros.
- **Teste em navegador:** execução do build em Chromium (desktop 1280 px e celular 390 px). Verificado: sem rolagem horizontal, logo carregando, criação, avanço de etapa e exclusão de aviso funcionando.
- **Dados externos:** testados com respostas simuladas da Open-Meteo e do INPE (a máquina de teste não tinha acesso a essas APIs). O comportamento sem resposta também foi testado e mostra o aviso de demonstração. **Não foi testado com as APIs reais pelo Claude**; teste você no seu computador.
- **Notícias:** cada uma das 4 páginas foi aberta e o título, a data e o conteúdo foram conferidos contra o que está em `src/data/news.js`.
- **Não testado:** aparelho celular físico, leitores de tela e a API MockAPI (depende da URL do grupo).

## Onde a IA errou e foi corrigida

1. **Notícias inventadas:** a primeira versão tinha 3 manchetes atribuídas a INPE, Agência Brasil e Defesa Civil, com links para páginas iniciais genéricas. Não foi possível confirmá-las. Foram removidas e substituídas por 4 reportagens reais, com link direto. O trecho que lia um feed RSS por serviço de terceiros também saiu.
2. **Dados reais misturados com inventados:** o mapa mostrava números de focos de calor de demonstração mesmo quando o INPE falhava. Agora, sem resposta, o número não aparece e há aviso quando o ar usa valores de demonstração.
3. **Classes de CSS inválidas** (`w-15`, `backdrop-blur-xs`, `shadow-xs`, opacidade em `var()`), que o Tailwind ignorava em silêncio. Corrigidas.
4. **Linha do rio:** os pontos eram posicionados por divisão igual da altura, e não pela posição real dos textos. Agora usam medidas reais e um `ResizeObserver`.
5. **Promessas sem funcionamento:** botões de São Paulo, canais de WhatsApp/SMS/rádio e boletim por e-mail dão a impressão de enviar algo. Foram rotulados como simulação na interface.

## Análise crítica

- A IA acelerou o protótipo e a revisão de código, mas **escreveu com segurança coisas que não eram verdade** (as notícias). Todo dado factual precisou de conferência manual.
- O critério de risco por PM2,5 é uma simplificação do projeto, não uma norma oficial.
- Respostas do formulário vieram sobretudo de pessoas de grande cidade; elas medem apoio à ideia, não a necessidade de quem vive na Amazônia. A validação com moradores e agentes de saúde continua pendente.
- O que é decisão humana: o tema, o nome, a paleta, a logo, os textos finais e o que entra ou não na entrega.
