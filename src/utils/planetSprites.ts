import { Assets, Texture } from 'pixi.js';
import type { SystemPlanetSummary } from '../types/starSystem';
import gasPlanetUrl from '../assets/images/planets/gas.png';
import icePlanetUrl from '../assets/images/planets/ice.png';
import lavaPlanetUrl from '../assets/images/planets/lava.png';
import rockyPlanetUrl from '../assets/images/planets/rocky.png';

export const PLANET_TEXTURE_URLS: Record<SystemPlanetSummary['type'], string> = {
  rocky: rockyPlanetUrl,
  gas: gasPlanetUrl,
  ice: icePlanetUrl,
  lava: lavaPlanetUrl,
};

export const loadPlanetTextures = async (): Promise<
  Record<SystemPlanetSummary['type'], Texture>
> => {
  const entries = await Promise.all(
    (Object.keys(PLANET_TEXTURE_URLS) as SystemPlanetSummary['type'][]).map(
      async (type) => {
        const texture = await Assets.load<Texture>(PLANET_TEXTURE_URLS[type]);
        return [type, texture] as const;
      },
    ),
  );

  return Object.fromEntries(entries) as Record<SystemPlanetSummary['type'], Texture>;
};
