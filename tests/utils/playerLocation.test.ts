import { describe, expect, it } from 'vitest';
import { getPlanetMapPosition } from '@utils/planetOrbitLayout';
import {
  getPlayerPlanetIdFromLocation,
  getPlayerSystemPositionFromLocation,
  getStarSystemIdFromLocation,
} from '@utils/playerLocation';

describe('getStarSystemIdFromLocation', () => {
  it('returns the star system id from a valid location', () => {
    const location = {
      cube: { id: 'cube-1' },
      starSystem: { id: 'system-1', position: { x: 0, y: 0 } },
    };

    expect(getStarSystemIdFromLocation(location)).toBe('system-1');
  });

  it('returns null for null or non-object values', () => {
    expect(getStarSystemIdFromLocation(null)).toBeNull();
    expect(getStarSystemIdFromLocation(undefined)).toBeNull();
    expect(getStarSystemIdFromLocation('system')).toBeNull();
  });

  it('returns null when starSystem id is missing or empty', () => {
    expect(getStarSystemIdFromLocation({ cube: { id: 'c' } })).toBeNull();
    expect(getStarSystemIdFromLocation({ cube: { id: 'c' }, starSystem: { id: '' } })).toBeNull();
  });
});

describe('getPlayerPlanetIdFromLocation', () => {
  it('returns the planet id when the player is on a planet', () => {
    const location = {
      cube: { id: 'cube-1' },
      starSystem: { id: 'system-1' },
      planet: { id: 'planet-1', hex_coords: { q: 0, r: 0 } },
    };

    expect(getPlayerPlanetIdFromLocation(location)).toBe('planet-1');
  });
});

describe('getPlayerSystemPositionFromLocation', () => {
  const planets = [
    { id: 'planet-1', name: 'A', distanceFromStar: 100, radius: 7, type: 'rocky' as const, resources: {} },
    { id: 'planet-2', name: 'B', distanceFromStar: 80, radius: 9, type: 'ice' as const, resources: {} },
  ];

  it('returns the map position when the player is in the star system', () => {
    const location = {
      cube: { id: 'cube-1' },
      starSystem: { id: 'system-1', position: { x: 12, y: -8 } },
    };

    expect(getPlayerSystemPositionFromLocation(location, planets)).toEqual({ x: 12, y: -8 });
  });

  it('returns the planet position when the player is on a planet', () => {
    const location = {
      cube: { id: 'cube-1' },
      starSystem: { id: 'system-1' },
      planet: { id: 'planet-2', hex_coords: { q: 1, r: 2 } },
    };

    expect(getPlayerSystemPositionFromLocation(location, planets)).toEqual(
      getPlanetMapPosition(planets[1], planets),
    );
  });
});
