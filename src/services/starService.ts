import type { Star } from '../types/star';
import { api } from './api';

export const starService = {
  async getStar(starId: string): Promise<Star> {
    const response = await api.get<Star>(`/stars/${starId}`);
    return response.data;
  },
};
