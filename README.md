# Solaris

2D star system visualization client for **Infinity** (stars, planets, orbits, resources).

Part of the [Infinity monorepo](../AGENTS.md). Agent guide: [AGENTS.md](AGENTS.md).

## Stack

- **React 18** — UI framework
- **TypeScript 5** — Type safety
- **Vite 5** — Bundler and dev server
- **PixiJS 7** — 2D system-map rendering
- **Zustand 4** — State management
- **Axios** — HTTP client

## Getting started

From the **monorepo root**, start shared infrastructure first (databases + Infinity Server) — see [../AGENTS.md](../AGENTS.md).

```bash
cd solaris
npm install
npm run dev
```

Dev server: [http://localhost:3003/solaris/](http://localhost:3003/solaris/)

| Field | Value |
|-------|-------|
| Dev port | `3003` |
| Base path | `/solaris/` |
| API prefix | `/infinity/*` (proxied to `http://localhost:4000`) |

The Caddy route for `/solaris/*` is not wired yet — use the dev server URL directly until that is added (see [../documentation/TO-BE-FIXED.md](../documentation/TO-BE-FIXED.md)).

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Development server (port 3003) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

## Configuration

REST calls use the `/infinity` prefix. In development, Vite proxies `/infinity/*` to the Infinity Server at `http://localhost:4000` (configure in `vite.config.ts` when the Vite scaffold is in place).

## Project structure

Early scaffold:

```
solaris/
├── src/
│   └── vite-env.d.ts
├── package.json
├── .env.example
├── AGENTS.md
└── README.md
```

Target layout (see [AGENTS.md](AGENTS.md)):

```
src/
├── components/          # React UI + PixiJS canvas wrappers
├── hooks/
├── stores/              # starSystemStore (Zustand)
├── types/
├── App.tsx
└── main.tsx
vite.config.ts           # base: /solaris/, dev proxy to :4000
```

## Related projects

| Client | Directory | Role |
| ------ | --------- | ---- |
| Infinity Server | [`infinity/`](../infinity/) | Backend API |
| Stellar Gate | [`stellar-gate/`](../stellar-gate/) | Authentication |
| Cosmos Governance | [`cosmos-governance/`](../cosmos-governance/) | Administration |
| Terra View | [`terra-view/`](../terra-view/) | Planetary surface (downstream) |
| Galaxy View | `galaxy/` *(planned)* | 3D galaxy (upstream) |
