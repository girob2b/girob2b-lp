# GiroB2B — Landing Page

Landing page institucional do GiroB2B. Stack: **Vite + React + TypeScript + Tailwind CSS v4 + CSS Modules**.

> Para tokens visuais (cores, tipografia, logo), consulte [`docs/DESIGN_SYSTEM.md`](../../docs/DESIGN_SYSTEM.md). Os tokens da landing vivem em [`src/styles/tokens.css`](src/styles/tokens.css).

## Stack

- **Vite** — build tool
- **React + TypeScript** — UI
- **Tailwind CSS v4** — utilitários
- **CSS Modules** — estilização local em componentes complexos
- **DM Sans** — fonte principal (woff2 local em `src/fonts/`)

## Rodar localmente

Da raiz do monorepo (pnpm gerencia o workspace):

```bash
pnpm install                       # instala todos os workspaces
pnpm --filter landing-page dev     # ou `pnpm run dev:landing`
```

URL padrão: `http://localhost:5173`.

## Build

```bash
pnpm --filter landing-page build
```

Saída em `dist/`.

## Estrutura

```
apps/girob2b-landing-page/
├── src/
│   ├── components/     Componentes React (Header, Hero, Features, etc.)
│   ├── pages/          Páginas roteadas (/, /como-funciona, /funcionalidades, /about, /contato)
│   ├── styles/         tokens.css + LandingPage.module.css
│   ├── fonts/          DM Sans woff2
│   ├── App.tsx
│   └── index.css       globals + Tailwind
├── public/             Assets estáticos (logos, imagens de equipe)
└── tests/
    ├── validators.test.ts
    └── screenshots/    QA visual organizado por viewport
        ├── desktop/    1440px
        ├── tablet/     768px
        ├── mobile/     375px
        └── before/     baselines pré-fix
```

## Testes

- **Unitários:** `tests/validators.test.ts` (Vitest).
- **QA visual:** screenshots em `tests/screenshots/` capturadas via Playwright MCP. Não rodam em CI — referência manual durante refactors visuais.
- **Snapshots transient:** `.playwright-mcp/` é gerada pelo MCP e ignorada pelo git.

## Convenções

- PNGs no root da pasta são bloqueados pelo `.gitignore` — sempre mover para `tests/screenshots/<viewport>/`.
- Tokens visuais: usar variáveis CSS (`var(--color-teal-deep)`, etc.), não hex inline. Para componentes novos, primeiro veja se já existe utilitário no [`DESIGN_SYSTEM.md`](../../docs/DESIGN_SYSTEM.md).
