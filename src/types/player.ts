export interface StarSystemIdentity {
  id: string;
}

export interface StarSystemLocation extends StarSystemIdentity {
  position: {
    x: number;
    y: number;
  };
}

export interface PlanetLocation {
  id: string;
  hex_coords: {
    q: number;
    r: number;
  };
}

export interface PlayerLocationOnPlanet {
  cube: { id: string };
  starSystem: StarSystemIdentity;
  planet: PlanetLocation;
}

export interface PlayerLocationInStarSystem {
  cube: { id: string };
  starSystem: StarSystemLocation;
}

export interface Player {
  id: string;
  userId: string;
  location:
    | PlayerLocationInStarSystem
    | PlayerLocationOnPlanet
    | Record<string, unknown>
    | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnterGameResponse {
  player: Player;
}
