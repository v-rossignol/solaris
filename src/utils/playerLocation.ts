import type { SystemPlanetSummary } from '../types/starSystem';
import { getPlanetMapPosition } from './planetOrbitLayout';
import type { Vec2 } from './systemMapLayout';

export const getStarSystemIdFromLocation = (location: unknown): string | null => {
  if (location == null || typeof location !== 'object') {
    return null;
  }

  const starSystem = (location as { starSystem?: unknown }).starSystem;
  if (starSystem == null || typeof starSystem !== 'object') {
    return null;
  }

  const id = (starSystem as { id?: unknown }).id;
  return typeof id === 'string' && id.length > 0 ? id : null;
};

export const getPlayerPlanetIdFromLocation = (location: unknown): string | null => {
  if (location == null || typeof location !== 'object') {
    return null;
  }

  const planet = (location as { planet?: unknown }).planet;
  if (planet == null || typeof planet !== 'object') {
    return null;
  }

  const id = (planet as { id?: unknown }).id;
  return typeof id === 'string' && id.length > 0 ? id : null;
};

const readVec2 = (value: unknown): Vec2 | null => {
  if (value == null || typeof value !== 'object') {
    return null;
  }

  const { x, y } = value as { x?: unknown; y?: unknown };
  if (typeof x !== 'number' || typeof y !== 'number') {
    return null;
  }

  return { x, y };
};

export const getPlayerSystemPositionFromLocation = (
  location: unknown,
  planets: SystemPlanetSummary[],
): Vec2 | null => {
  const planetId = getPlayerPlanetIdFromLocation(location);
  if (planetId) {
    const planet = planets.find((entry) => entry.id === planetId);
    return planet ? getPlanetMapPosition(planet, planets) : null;
  }

  if (location == null || typeof location !== 'object') {
    return null;
  }

  const starSystem = (location as { starSystem?: unknown }).starSystem;
  if (starSystem == null || typeof starSystem !== 'object') {
    return null;
  }

  return readVec2((starSystem as { position?: unknown }).position);
};
