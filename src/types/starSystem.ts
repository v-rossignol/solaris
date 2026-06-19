export interface SystemPlanetSummary {
  id: string;
  name: string;
  distanceFromStar: number;
  radius: number;
  type: 'rocky' | 'gas' | 'ice' | 'lava';
  resources: Record<string, number>;
}

export interface StarSystem {
  _id: string;
  name: string;
  planets: SystemPlanetSummary[];
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}
