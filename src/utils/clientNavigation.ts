export const getTerraViewPlanetPath = (planetId: string): string =>
  `/terra-view/${encodeURIComponent(planetId)}`;

export const navigateToTerraViewPlanet = (planetId: string): void => {
  window.location.assign(getTerraViewPlanetPath(planetId));
};
