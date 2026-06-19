import { describe, expect, it } from 'vitest';
import {
  computeSystemBounds,
  fitSystemMapLayout,
  worldToScreen,
} from '@utils/systemMapLayout';
import { getPlanetVisualRadius } from '@utils/planetColors';

describe('systemMapLayout', () => {
  const planets = [
    { distanceFromStar: 100, radius: 7, index: 0, planetCount: 2 },
    { distanceFromStar: 80, radius: 9, index: 1, planetCount: 2 },
  ];

  it('fits the star and planets into the viewport', () => {
    const bounds = computeSystemBounds(planets, { x: 20, y: 10 }, getPlanetVisualRadius);
    const layout = fitSystemMapLayout(bounds, 800, 600);
    const star = worldToScreen({ x: 0, y: 0 }, layout);

    expect(layout.scale).toBeGreaterThan(0);
    expect(star.x).toBeGreaterThan(0);
    expect(star.x).toBeLessThan(800);
    expect(star.y).toBeGreaterThan(0);
    expect(star.y).toBeLessThan(600);
  });

  it('maps world y-up to screen y-down', () => {
    const bounds = computeSystemBounds(planets, null, getPlanetVisualRadius);
    const layout = fitSystemMapLayout(bounds, 800, 600);
    const above = worldToScreen({ x: 0, y: 50 }, layout);
    const below = worldToScreen({ x: 0, y: -50 }, layout);

    expect(above.y).toBeLessThan(below.y);
  });
});
