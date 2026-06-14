# AI Agents Guide - Solaris

## Overview
Solaris is a 2D star system visualization client for the Infinity game. It renders star systems, planets, and resources using React, TypeScript, Vite, and PixiJS.

## Repository Structure
- src/App.tsx - Main visualization component with PixiJS
- src/stores/starSystemStore.ts - Zustand store for star system data
- src/types/ - TypeScript interfaces
- vite.config.ts - Vite configuration with proxy to Infinity Server

## Key Commands
- npm install - Install dependencies
- npm run dev - Start development server on port 3002
- npm run build - Build for production
- npm run preview - Preview production build

## Development Notes
- API base: /infinity (proxied to http://localhost:3000 in dev)
- Star system data: GET /infinity/galaxy/systems/{systemId}
- Planet types: rocky, gas, ice, lava
- Colors: Rocky=brown, Gas=light blue, Ice=light blue, Lava=orange-red

## Stack
- React 18, TypeScript 5, Vite 5
- PixiJS 7 for 2D rendering
- Zustand 4 for state management
- Axios for HTTP requests

## Related Repositories
- Infinity Server (backend)
- Stellar Gate (auth)
- Cosmos Governance (admin)
- Terra View (planet surface)
- Galaxy View (3D galaxy, planned)