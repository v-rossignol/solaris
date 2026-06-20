# AGENTS.md — Solaris

2D star system visualization client for **Infinity** (stars, planets, orbits, resources). React 18 + TypeScript + Vite SPA with **PixiJS 7** for system-map rendering.

**Monorepo context:** [../AGENTS.md](../AGENTS.md) · **Known gaps:** [../documentation/TO-BE-FIXED.md](../documentation/TO-BE-FIXED.md)

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server → http://localhost:3003/solaris/
npm run build        # Production build → dist/
npm run preview      # Preview production build
```

No ESLint is configured yet. After changes, run `npm run build` and `npm run test`.

**Local dev:** Start databases and the Infinity server first (see root [AGENTS.md](../AGENTS.md)). Vite proxies `/infinity/*` to `http://localhost:4000`. Caddy route for `/solaris/*` is not wired yet — use the dev server URL directly until [TO-BE-FIXED §3](../documentation/TO-BE-FIXED.md) is resolved.

| Field | Value |
|-------|-------|
| Dev port | `3003` |
| Base path | `/solaris/` |
| API prefix | `/infinity/*` (REST + Socket.IO planned) |

---

## Project structure

Current scaffold (early stage):

```
src/
└── vite-env.d.ts
package.json
.env.example
```

Target layout (from [README.md](README.md)):

```
src/
├── components/          # React UI + PixiJS canvas wrappers
│   ├── ui/              # HUD, planet info overlay, navigation
│   └── game/            # StarSystemMap, PlanetSprite, OrbitLayer
├── hooks/               # useStarSystem, useSocket, etc.
├── stores/              # Zustand (starSystemStore)
├── types/               # starSystem, planet, API types
├── App.tsx              # Root component
├── main.tsx             # React entry point
└── vite-env.d.ts
index.html
vite.config.ts           # base: /solaris/, dev proxy to :4000
```

---

## Implementation status

| Area | Client | Server |
|------|--------|--------|
| App scaffold | Package + types only — no Vite config or entry yet | — |
| PixiJS system map | Not started | — |
| Star system data fetch | Not started | `GET /infinity/galaxy/systems/:systemId` |
| Planet selection / handoff | Not started | `POST /infinity/players/me/location/enter-planet` |
| Player position in system | Not started | `PATCH /infinity/players/me/location/system` |
| Real-time sync | Not started | Socket.IO `SYSTEM_MOVE`, `SYSTEM_UPDATE` |
| Auth / session | Partial — cookie session (`withCredentials`), `GET /auth/me` on bootstrap, 401 → Stellar Gate; login/logout via Stellar Gate | Cookie-based (`infinity_token`) — see [../contracts/auth-api.yaml](../contracts/auth-api.yaml) |
| Upstream navigation | Planned from `/galaxy/` | Galaxy View not in repo yet |
| Downstream navigation | Hand off to `/terra-view/` | `GET /infinity/planets/:planetId` |

Planet types and domain model: [../contracts/game-rules.md](../contracts/game-rules.md) — Places → Planets.

---

## Architecture rules

### Rendering (PixiJS + React)

- Mount PixiJS in a dedicated React component; destroy the application and release textures in `useEffect` cleanup.
- Load assets via `PIXI.Assets.load()`; avoid leaking textures or event listeners.
- Keep React for UI overlays (HUD, planet info); keep the system map in PixiJS for performance.
- Prefer sprite batching for planets and static celestial objects.

### Coordinates

- Server stores **orbital distance** (`distanceFromStar`) for planets in a star system — clients derive map angles from planet index for display. Player position at system depth still uses local 2D map coordinates (`x`, `y`).
- Client must map server coordinates to screen pixels; do not assume latitude/longitude or hex coords at this view level.
- See [../contracts/game-api.yaml](../contracts/game-api.yaml) and player location routes for server coordinate fields.

### API and real-time

- REST base path: `/infinity/*` (Vite dev proxy forwards to `:4000`).
- Use `withCredentials: true` on HTTP clients when auth cookies are required.
- Do **not** store JWT in `localStorage`, `sessionStorage`, or JS state.
- `GET /infinity/galaxy/systems/:systemId` requires JWT; `systemId` is the parent star UUID.
- Socket.IO client integration is planned; event names and payloads follow server gateway conventions.

### Navigation (cross-client)

- Enter from **Galaxy View** via full page navigation with a selected `systemId` (handoff TBD).
- Select a planet → navigate to `/terra-view/` with the chosen `planetId` (full page navigation, not React Router across SPAs).
- Return to galaxy → `POST /infinity/players/me/location/leave-system` then navigate to `/galaxy/`.

### Layering

| Layer | Responsibility |
| ----- | -------------- |
| `components/ui/` | React UI only |
| `components/game/` | PixiJS canvas + thin React wrapper |
| `stores/` | Star system and UI state |
| `hooks/` | Socket, map lifecycle, coordinate helpers |
| `utils/` | Pure functions (projections, orbit math) |

---

## Document conventions

Shared monorepo standards: [../rules/documents.md](../rules/documents.md).

**Working directory:** Do not read, search, or follow links into any `documentation/` directory (monorepo root, this sub-project, or another sub-project) unless the user explicitly references a path. Links elsewhere in this file are pointers for the user — use `../contracts/` and source code for implementation context.

Code, paths, and API identifiers stay in **English**. Do not create documentation files unless explicitly requested.

---

## Code style

- TypeScript strict mode — no `any` unless unavoidable; prefer explicit interfaces in `src/types/`.
- Functional components and hooks only.
- Keep diffs minimal; match existing patterns before introducing new abstractions.
- UI copy and code identifiers are in **English**.

---

## API contract

Canonical server reference: [../contracts/game-api.yaml](../contracts/game-api.yaml)

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| GET | `/infinity/galaxy/systems/:systemId` | JWT | Get or generate a star system (`systemId` = star UUID) |
| POST | `/infinity/players/me/location/enter-system` | JWT | View transition: cube → star system |
| POST | `/infinity/players/me/location/enter-planet` | JWT | View transition: star system → planet |
| POST | `/infinity/players/me/location/leave-planet` | JWT | View transition: planet → star system |
| POST | `/infinity/players/me/location/leave-system` | JWT | View transition: star system → cube |
| PATCH | `/infinity/players/me/location/system` | JWT | Update player position in the system map |

Real-time: `SYSTEM_MOVE`, `SYSTEM_UPDATE` — see [../contracts/asyncapi.yaml](../contracts/asyncapi.yaml).

When adding API or socket usage, define types in `src/types/` aligned with server responses and [../contracts/schemas/](../contracts/schemas/).

---

## Do not touch

| Path | Reason |
| ---- | ------ |
| `dist/` | Generated build output |
| `node_modules/` | Dependencies |
| `package-lock.json` | Only change when adding/removing dependencies |

Do not commit secrets (`.env`, credentials). Do not create git commits unless explicitly asked.

---

## Reference docs

Index for human navigation and explicit user references — **not** for agent auto-discovery.

- [../contracts/game-api.yaml](../contracts/game-api.yaml) — REST contract (source of truth)
- [../contracts/asyncapi.yaml](../contracts/asyncapi.yaml) — Socket.IO events
- [../documentation/TO-BE-FIXED.md](../documentation/TO-BE-FIXED.md) — Cross-project deferred fixes (incl. missing Caddy `/solaris/` route)
- [README.md](README.md) — Quick start

---

## Definition of done

1. `npm run build` passes with no TypeScript errors.
2. PixiJS resources are cleaned up on unmount — no texture or listener leaks.
3. System-map coordinates match server `x`/`y` layout — no ad-hoc coordinate systems.
4. New API or socket usage matches [../contracts/game-api.yaml](../contracts/game-api.yaml) and [../contracts/asyncapi.yaml](../contracts/asyncapi.yaml).
5. Cross-client navigation uses full page loads to `/terra-view/` or `/galaxy/`, not cross-SPA React Router links.
