import type { EnterGameResponse } from '../types/player';
import { api } from './api';

const DEFAULT_RELOCATE_POSITION = { x: 0, y: 0 };

export const playerService = {
  async enterGame(): Promise<EnterGameResponse> {
    const response = await api.post<EnterGameResponse>('/players/me/enter-game');
    return response.data;
  },

  async relocateToStarSystem(
    starSystemId: string,
    position = DEFAULT_RELOCATE_POSITION,
  ): Promise<EnterGameResponse> {
    const response = await api.post<EnterGameResponse>('/players/me/location/enter-system', {
      starSystemId,
      x: position.x,
      y: position.y,
    });
    return response.data;
  },
};
