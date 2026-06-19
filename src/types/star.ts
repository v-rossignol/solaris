export type StarType = 'yellow' | 'red' | 'blue' | 'white';

export interface Star {
  id: string;
  name: string;
  local_coords: { x: number; y: number; z: number };
  cube_id: string;
  properties: { type: StarType };
}
