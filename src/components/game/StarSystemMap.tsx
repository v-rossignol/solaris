import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Application, Circle, Container, Graphics, Sprite, Text } from 'pixi.js';
import type { DisplayObject } from 'pixi.js';
import type { StarSystem } from '../../types/starSystem';
import { useContainerSize } from '../../hooks/useContainerSize';
import { getPlanetVisualRadius } from '../../utils/planetColors';
import type { StarType } from '../../types/star';
import { loadPlanetTextures } from '../../utils/planetSprites';
import { loadStarTextures } from '../../utils/starSprites';
import { getPlanetMapPosition, getPlanetOrbitAngle } from '../../utils/planetOrbitLayout';
import { pageBackgroundStyle } from '../../utils/pageBackground';
import {
  computeSystemBounds,
  fitSystemMapLayout,
  PLAYER_MARKER_RADIUS,
  STAR_VISUAL_RADIUS,
  worldToScreen,
  type Vec2,
} from '../../utils/systemMapLayout';
import { navigateToTerraViewPlanet } from '../../utils/clientNavigation';

const attachPlanetClick = (target: DisplayObject, planetId: string, hitRadius?: number): void => {
  target.eventMode = 'static';
  target.cursor = 'pointer';
  if (hitRadius != null) {
    target.hitArea = new Circle(0, 0, hitRadius);
  }
  target.on('pointertap', () => {
    navigateToTerraViewPlanet(planetId);
  });
};

export interface StarSystemMapProps {
  starSystem: StarSystem;
  starType: StarType;
  playerPosition: Vec2 | null;
  playerPlanetId?: string | null;
}

const viewportStyle: CSSProperties = {
  flex: 1,
  width: '100%',
  minHeight: 0,
  position: 'relative',
  overflow: 'hidden',
};

const backgroundLayerStyle: CSSProperties = {
  ...pageBackgroundStyle,
  position: 'absolute',
  inset: 0,
  zIndex: 0,
};

const canvasLayerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
};

export function StarSystemMap({
  starSystem,
  starType,
  playerPosition,
  playerPlanetId = null,
}: StarSystemMapProps) {
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const canvasHostRef = useRef<HTMLDivElement>(null);

  const layout = useMemo(() => {
    if (size.width <= 0 || size.height <= 0) {
      return null;
    }

    const bounds = computeSystemBounds(
      starSystem.planets.map((planet, index) => ({
        distanceFromStar: planet.distanceFromStar,
        radius: planet.radius,
        index,
        planetCount: starSystem.planets.length,
      })),
      playerPosition,
      getPlanetVisualRadius,
    );
    return fitSystemMapLayout(bounds, size.width, size.height);
  }, [playerPosition, size.height, size.width, starSystem.planets]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host || layout == null) {
      return;
    }

    let cancelled = false;
    let app: Application | null = null;

    const setup = async () => {
      app = new Application({
        width: layout.viewportWidth,
        height: layout.viewportHeight,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (cancelled) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      app.view.style.display = 'block';
      app.view.style.background = 'transparent';
      host.replaceChildren(app.view);

      const root = new Container();
      app.stage.addChild(root);

      const starPosition = worldToScreen({ x: 0, y: 0 }, layout);
      const orbitDistances = starSystem.planets.map((planet) => planet.distanceFromStar);

      for (let index = 0; index < starSystem.planets.length; index++) {
        const planet = starSystem.planets[index];
        const worldPosition = getPlanetMapPosition(planet, starSystem.planets);
        const screenPosition = worldToScreen(worldPosition, layout);
        const orbitRadius = planet.distanceFromStar * layout.scale;

        const orbit = new Graphics();
        orbit.lineStyle(1, 0x2a3344, 0.55);
        orbit.drawCircle(starPosition.x, starPosition.y, orbitRadius);
        root.addChild(orbit);
      }

      const [planetTextures, starTextures] = await Promise.all([
        loadPlanetTextures(),
        loadStarTextures(),
      ]);
      if (cancelled) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      const starRadius = STAR_VISUAL_RADIUS * layout.scale;
      const starSprite = new Sprite(starTextures[starType]);
      starSprite.anchor.set(0.5);
      const starTextureSize = Math.max(starSprite.texture.width, starSprite.texture.height);
      starSprite.scale.set((starRadius * 2) / starTextureSize);
      starSprite.position.set(starPosition.x, starPosition.y);
      root.addChild(starSprite);

      for (let index = 0; index < starSystem.planets.length; index++) {
        const planet = starSystem.planets[index];
        const worldPosition = getPlanetMapPosition(planet, starSystem.planets);
        const screenPosition = worldToScreen(worldPosition, layout);
        const planetRadius = getPlanetVisualRadius(planet.radius) * layout.scale;
        const isPlayerPlanet = playerPlanetId === planet.id;

        const sprite = new Sprite(planetTextures[planet.type]);
        sprite.anchor.set(0.5);
        const textureSize = Math.max(sprite.texture.width, sprite.texture.height);
        sprite.scale.set((planetRadius * 2) / textureSize);
        sprite.rotation = -getPlanetOrbitAngle(planet.distanceFromStar, orbitDistances);
        sprite.position.set(screenPosition.x, screenPosition.y);
        attachPlanetClick(sprite, planet.id, planetRadius);
        root.addChild(sprite);

        if (isPlayerPlanet) {
          const highlight = new Graphics();
          highlight.lineStyle(2, 0x7eb8ff, 1);
          highlight.drawCircle(screenPosition.x, screenPosition.y, planetRadius + 2);
          root.addChild(highlight);
        }

        const label = new Text(planet.name, {
          fill: 0xd0d0d0,
          fontFamily: 'system-ui, sans-serif',
          fontSize: 12,
        });
        label.anchor.set(0.5, 0);
        label.position.set(screenPosition.x, screenPosition.y + planetRadius + 4);
        attachPlanetClick(label, planet.id);
        root.addChild(label);
      }

      if (playerPosition) {
        const markerPosition = worldToScreen(playerPosition, layout);
        const marker = new Graphics();
        marker.lineStyle(2, 0x7eb8ff, 1);
        marker.beginFill(0x7eb8ff, 0.35);
        marker.drawCircle(markerPosition.x, markerPosition.y, PLAYER_MARKER_RADIUS);
        marker.endFill();
        root.addChild(marker);
      }
    };

    void setup();

    return () => {
      cancelled = true;
      app?.destroy(true, { children: true, texture: true });
      host.replaceChildren();
    };
  }, [layout, playerPlanetId, playerPosition, starSystem, starType]);

  return (
    <div ref={ref} style={viewportStyle} aria-label={`Star system map: ${starSystem.name}`}>
      <div style={backgroundLayerStyle} aria-hidden="true" />
      {layout != null ? <div ref={canvasHostRef} style={canvasLayerStyle} /> : null}
    </div>
  );
}
