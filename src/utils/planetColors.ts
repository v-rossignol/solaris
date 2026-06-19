import type { SystemPlanetSummary } from '../types/starSystem';

const PLANET_TYPE_COLORS: Record<SystemPlanetSummary['type'], number> = {
  rocky: 0xb87333,
  gas: 0xd4a574,
  ice: 0xa8d8ea,
  lava: 0xff6b35,
};

export const getPlanetColor = (type: SystemPlanetSummary['type']): number =>
  PLANET_TYPE_COLORS[type];

export const getPlanetVisualRadius = (hexRadius: number): number => 5 + hexRadius * 1.0;
