import { useEffect, useState } from 'react';
import axios from 'axios';
import { authService } from '../services/authService';
import { playerService } from '../services/playerService';
import { starService } from '../services/starService';
import { starSystemService } from '../services/starSystemService';
import type { StarType } from '../types/star';
import type { StarSystem } from '../types/starSystem';
import { getErrorMessage } from '../utils/helpers';
import {
  getPlayerPlanetIdFromLocation,
  getPlayerSystemPositionFromLocation,
  getStarSystemIdFromLocation,
} from '../utils/playerLocation';
import type { Vec2 } from '../utils/systemMapLayout';

export type LandingPageStatus = 'loading' | 'ready' | 'error';

export interface LandingPageState {
  status: LandingPageStatus;
  playerName: string | null;
  starName: string | null;
  starType: StarType | null;
  starSystem: StarSystem | null;
  playerPosition: Vec2 | null;
  playerPlanetId: string | null;
  error: string | null;
}

const LOGIN_PATH = '/stellar-gate/';

export const useLandingPageBootstrap = (): LandingPageState => {
  const [state, setState] = useState<LandingPageState>({
    status: 'loading',
    playerName: null,
    starName: null,
    starType: null,
    starSystem: null,
    playerPosition: null,
    playerPlanetId: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (cancelled) {
          return;
        }

        const { player } = await playerService.enterGame();
        if (cancelled) {
          return;
        }

        if (!player) {
          setState({
            status: 'error',
            playerName: null,
            starName: null,
            starType: null,
            starSystem: null,
            playerPosition: null,
            playerPlanetId: null,
            error: 'No player profile found. Enter the game from Stellar Gate first.',
          });
          return;
        }

        const systemId = getStarSystemIdFromLocation(player.location);
        if (!systemId) {
          setState({
            status: 'error',
            playerName: user.username,
            starName: null,
            starType: null,
            starSystem: null,
            playerPosition: null,
            playerPlanetId: null,
            error:
              'Your player is not in a star system. Travel to a star system before opening Solaris.',
          });
          return;
        }

        const [starSystem, star] = await Promise.all([
          starSystemService.getStarSystem(systemId),
          starService.getStar(systemId),
        ]);
        if (cancelled) {
          return;
        }

        setState({
          status: 'ready',
          playerName: user.username,
          starName: starSystem.name,
          starType: star.properties.type,
          starSystem,
          playerPosition: getPlayerSystemPositionFromLocation(player.location, starSystem.planets),
          playerPlanetId: getPlayerPlanetIdFromLocation(player.location),
          error: null,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setState({
            status: 'error',
            playerName: null,
            starName: null,
            starType: null,
            starSystem: null,
            playerPosition: null,
            playerPlanetId: null,
            error: `You are not signed in. Log in via Stellar Gate (${LOGIN_PATH}).`,
          });
          return;
        }

        setState({
          status: 'error',
          playerName: null,
          starName: null,
          starType: null,
          starSystem: null,
          playerPosition: null,
          playerPlanetId: null,
          error: getErrorMessage(error, 'Failed to load player or star system data.'),
        });
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
