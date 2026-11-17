# SumaUma 2.0 — Informação que protege a natureza

Aplicação web desenvolvida em **React + Vite + Tailwind CSS** para a **FIAP Global Solution 2026.2**.

## Como rodar no VS Code
1. Extraia a pasta `sumauma-react` e abra no **VS Code**.
2. Abra o terminal integrado (`Ctrl + '`) e instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse o link local exibido no terminal (geralmente `http://localhost:5173`).

## Estrutura de Pastas
- `src/components/`: Componentes modulares (`Header`, `Hero`, `RiverStory`, `Map3D`, `SaoPauloHelp`, `NewsRadar`, `ReportForm`, `BottomDock`, `SettingsSheet`).
- `src/services/api.js`: Integração com Open-Meteo (PM2,5 e clima), INPE Queimadas, CRUD de avisos (MockAPI ou LocalStorage) e Radar de Notícias Reais.
- `src/data/regions.js`: Coordenadas e metadados das regiões monitoradas na Amazônia, ações de apoio de São Paulo e manchetes verificadas.
- `src/data/brazilStates.js`: Limites estaduais simplificados do mapa do Brasil, usados na visualização em relevo. Dados do Code for America click_that_hood; licença MIT em `LICENSES/click-that-hood.txt`.
- `src/index.css`: Tokens de tema (Claro, Escuro, Alto Contraste, Tamanhos de Fonte, Reduzir Movimento) e animações customizadas.

## Configuração Opcional da API de Avisos
Abra `src/services/api.js` e cole a URL do seu recurso `avisos` do MockAPI.io na constante `API_URL`. Sem URL, o sistema funciona perfeitamente salvando no `localStorage` com fila offline.
