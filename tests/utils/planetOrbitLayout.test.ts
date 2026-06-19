import { describe, expect, it } from 'vitest';
import {
  getPlanetMapPosition,
  getPlanetOrbitAngle,
  planetOrbitPosition,
} from '@utils/planetOrbitLayout';

describe('planetOrbitLayout', () => {
  const orbitDistances = [80, 100, 130];

  it('maps inner planets to the top and outer planets to the bottom', () => {
    expect(getPlanetOrbitAngle(80, orbitDistances)).toBeCloseTo(-Math.PI / 2);
    expect(getPlanetOrbitAngle(130, orbitDistances)).toBeCloseTo(Math.PI / 2);
  });

  it('places planets on a circle at their orbital distance', () => {
    const position = planetOrbitPosition(100, 1, 3);
    const distance = Math.hypot(position.x, position.y);

    expect(distance).toBeCloseTo(100);
  });

  it('returns the same position for a planet in the system list', () => {
    const planets = [
      { id: 'planet-1', distanceFromStar: 80 },
      { id: 'planet-2', distanceFromStar: 100 },
    ];

    expect(getPlanetMapPosition(planets[1], planets)).toEqual(
      planetOrbitPosition(100, 1, 2),
    );
  });
});
