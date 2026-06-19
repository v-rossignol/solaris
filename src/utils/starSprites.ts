import { Assets, Texture } from 'pixi.js';
import type { StarType } from '../types/star';
import blueStarUrl from '../assets/images/stars/blue.png';
import redStarUrl from '../assets/images/stars/red.png';
import whiteStarUrl from '../assets/images/stars/white.png';
import yellowStarUrl from '../assets/images/stars/yellow.png';

export const STAR_TEXTURE_URLS: Record<StarType, string> = {
  yellow: yellowStarUrl,
  red: redStarUrl,
  blue: blueStarUrl,
  white: whiteStarUrl,
};

export const loadStarTextures = async (): Promise<Record<StarType, Texture>> => {
  const entries = await Promise.all(
    (Object.keys(STAR_TEXTURE_URLS) as StarType[]).map(async (type) => {
      const texture = await Assets.load<Texture>(STAR_TEXTURE_URLS[type]);
      return [type, texture] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<StarType, Texture>;
};
