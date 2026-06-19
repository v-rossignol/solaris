import { planetOrbitPosition } from './planetOrbitLayout';

export interface Vec2 {
  x: number;
  y: number;
}

export interface MapBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface SystemMapLayout {
  scale: number;
  worldCenterX: number;
  worldCenterY: number;
  viewportWidth: number;
  viewportHeight: number;
}

const STAR_VISUAL_RADIUS = 14;
const PLAYER_MARKER_RADIUS = 7;
const MARKER_PADDING = 24;

export const computeSystemBounds = (
  planets: {
    distanceFromStar: number;
    radius: number;
    index: number;
    planetCount: number;
  }[],
  playerPosition: Vec2 | null,
  getPlanetRadius: (hexRadius: number) => number,
): MapBounds => {
  let minX = -STAR_VISUAL_RADIUS;
  let minY = -STAR_VISUAL_RADIUS;
  let maxX = STAR_VISUAL_RADIUS;
  let maxY = STAR_VISUAL_RADIUS;

  for (const planet of planets) {
    const { x, y } = planetOrbitPosition(
      planet.distanceFromStar,
      planet.index,
      planet.planetCount,
    );
    const visualRadius = getPlanetRadius(planet.radius);
    minX = Math.min(minX, x - visualRadius);
    minY = Math.min(minY, y - visualRadius);
    maxX = Math.max(maxX, x + visualRadius);
    maxY = Math.max(maxY, y + visualRadius);
  }

  if (playerPosition) {
    minX = Math.min(minX, playerPosition.x - PLAYER_MARKER_RADIUS);
    minY = Math.min(minY, playerPosition.y - PLAYER_MARKER_RADIUS);
    maxX = Math.max(maxX, playerPosition.x + PLAYER_MARKER_RADIUS);
    maxY = Math.max(maxY, playerPosition.y + PLAYER_MARKER_RADIUS);
  }

  return {
    minX: minX - MARKER_PADDING,
    minY: minY - MARKER_PADDING,
    maxX: maxX + MARKER_PADDING,
    maxY: maxY + MARKER_PADDING,
  };
};

export const fitSystemMapLayout = (
  bounds: MapBounds,
  viewportWidth: number,
  viewportHeight: number,
): SystemMapLayout => {
  const worldWidth = bounds.maxX - bounds.minX;
  const worldHeight = bounds.maxY - bounds.minY;
  const scale =
    worldWidth > 0 && worldHeight > 0
      ? Math.min(viewportWidth / worldWidth, viewportHeight / worldHeight)
      : 1;

  return {
    scale,
    worldCenterX: (bounds.minX + bounds.maxX) / 2,
    worldCenterY: (bounds.minY + bounds.maxY) / 2,
    viewportWidth,
    viewportHeight,
  };
};

export const worldToScreen = (point: Vec2, layout: SystemMapLayout): Vec2 => ({
  x: layout.viewportWidth / 2 + (point.x - layout.worldCenterX) * layout.scale,
  y: layout.viewportHeight / 2 - (point.y - layout.worldCenterY) * layout.scale,
});

export { PLAYER_MARKER_RADIUS, STAR_VISUAL_RADIUS };
