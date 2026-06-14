# Solaris

2D star system visualization client for the Infinity game.

## Overview

Solaris is a web-based client that renders star systems in 2D, displaying stars, planets, and their resources. It is part of the Infinity monorepo ecosystem.

## Features

- Real-time visualization of star systems
- Display of planets with their types (rocky, gas, ice, lava)
- Resource information overlay
- Interactive navigation

## Tech Stack

- Framework: React 18
- Language: TypeScript 5
- Build Tool: Vite 5
- 2D Rendering: PixiJS 7
- State Management: Zustand 4
- HTTP Client: Axios

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   git clone https://github.com/v-rossignol/solaris.git
   cd solaris

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

4. Open http://localhost:3002 in your browser.

## Configuration

The app connects to the Infinity Server API at /infinity. By default, it proxies to http://localhost:3000 in development. Update the proxy configuration in vite.config.ts to match your backend URL.

## Project Structure

solaris/
+-- src/
|   +-- App.tsx           # Main application component
|   +-- main.tsx          # React entry point
|   +-- index.css         # Global styles
|   +-- stores/
|   |   +-- starSystemStore.ts  # Zustand store for star system data
|   +-- types/
|       +-- index.ts      # Type exports
|       +-- starSystem.ts # Star system types
|       +-- planet.ts     # Planet types
+-- package.json
+-- vite.config.ts
+-- tsconfig.json
+-- README.md

## Related Projects

- Infinity Server - Backend API
- Stellar Gate - Authentication client
- Cosmos Governance - Admin client
- Terra View - Planetary surface client
- Galaxy View - 3D galaxy client (planned)

## License

MIT