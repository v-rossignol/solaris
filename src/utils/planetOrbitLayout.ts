import type { SystemPlanetSummary } from '../types/starSystem';
import type { Vec2 } from './systemMapLayout';

/** Deterministic orbit angle from orbital distance within the system. */
export const getPlanetOrbitAngle = (
  distanceFromStar: number,
  orbitDistances: number[],
): number => {
  const min = Math.min(...orbitDistances);
  const max = Math.max(...orbitDistances);
  const span = max - min;
  const normalized = span > 0 ? (distanceFromStar - min) / span : 0;
  return normalized * Math.PI - Math.PI / 2;
};

/** Deterministic map position from orbital distance and index in the system. */
export const planetOrbitPosition = (
  distanceFromStar: number,
  index: number,
  planetCount: number,
): Vec2 => {
  const angle = (2 * Math.PI * index) / Math.max(planetCount, 1) - Math.PI / 2;
  return {
    x: Math.cos(angle) * distanceFromStar,
    y: Math.sin(angle) * distanceFromStar,
  };
};

export const getPlanetMapPosition = (
  planet: Pick<SystemPlanetSummary, 'id' | 'distanceFromStar'>,
  planets: Pick<SystemPlanetSummary, 'id' | 'distanceFromStar'>[],
): Vec2 => {
  const index = planets.findIndex((entry) => entry.id === planet.id);
  return planetOrbitPosition(
    planet.distanceFromStar,
    index >= 0 ? index : 0,
    planets.length,
  );
};
