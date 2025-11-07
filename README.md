# ControlePontoWEB

Aplicação web (Next.js 14) para gestão de ponto mensal, permitindo registrar presença, faltas e substituições por turno, revisar informações e exportar relatórios em PDF e XLSX.

## Requisitos
- Node `>=18` (recomendado Node 18 LTS)
- NPM `>=9`

## Instalação
- Instale dependências:
  - `npm ci` (preferido) ou `npm install`
- Se usar VS Code, selecione a versão TypeScript do workspace:
  - Abra um arquivo `.ts`/`.tsx` → botão na barra de status “Version: x.y.z” → “Use Workspace Version”.

## Scripts
- `npm run dev` – roda o servidor de desenvolvimento
- `npm run build` – gera build de produção
- `npm run start` – inicia a aplicação em produção (após build)
- `npm run lint` – executa ESLint

## Rodando Localmente
- `npm run dev`
- Acesse `http://localhost:3000`

## Deploy (Netlify)
- O arquivo `netlify.toml` configura:
  - Build: `npm run build`
  - Publish: `.next`
  - `NODE_VERSION = 18`
- Plugin: `@netlify/plugin-nextjs`

## Funcionalidades
- Preenchimento mensal por dia e turno (manhã, tarde, noite).
- Registro de **faltas** e **substituições** por turno.
- Verificação e revisão das informações inseridas.
- Estimativa de salário baseada nos lançamentos.
- Exportação de ciclo em **PDF** e **XLSX**.

## Principais Rotas
- `/` – Página inicial
- `/home` – Ações rápidas
- `/preenchimento-mensal` – Fluxo de preenchimento
- `/registrar-falta` – Registro de faltas
- `/registrar-substituicao` – Registro de substituições
- `/verificar-informacoes` – Revisão
- `/estimativa-salario` – Estimativa de salário

## Estrutura de Pastas
- `src/app` – Páginas, estilos e helpers do fluxo mensal
- `src/components` – Componentes compartilhados (botões, tabelas, calendários)
- `src/core` – Tipos e lógica de ciclo
- `src/data` – Persistência/serviços e utilitários de exportação (PDF/XLSX)
- `src/types` – Tipos globais (React/JSX)

## Tecnologias
- Next.js 14, React 18
- Day.js (`dayjs`) para manipulação de datas
- `xlsx` para exportar Excel
- `jspdf` para gerar PDF
- `uuid` para IDs

## Convenções de Commit
- Recomenda-se o padrão **Conventional Commits**:
  - `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`

## Dicas e Solução de Problemas
- Arquivos grandes no commit (ex.: `@next/swc`):
  - O `.gitignore` já ignora `node_modules/`, `.next/`, `out/`, `coverage/`, logs, `.env*`, `*.tsbuildinfo`.
  - Se algum desses foi adicionado por engano:
    - `git reset` (limpa staging)
    - `git rm -r --cached .next node_modules` (remove do índice)
- Alertas de TypeScript/JSX no IDE:
  - Selecione a versão TypeScript do **workspace** e reinicie o TS Server.

## Licença
Projeto interno. Uso conforme políticas da organização.