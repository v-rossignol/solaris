import type { CSSProperties } from 'react';
import { useLandingPageBootstrap } from '../hooks/useLandingPageBootstrap';
import { pageBackgroundStyle } from '../utils/pageBackground';
import { StarSystemMap } from './game/StarSystemMap';
import { ClientHeader } from './ui/ClientHeader';

const layoutStyle: CSSProperties = {
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: 'system-ui, sans-serif',
  color: '#f0f0f0',
  ...pageBackgroundStyle,
};

const contentStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  minHeight: 0,
  width: '100%',
  overflow: 'hidden',
};

const centeredContentStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '1rem',
  overflow: 'auto',
};

const errorStyle: CSSProperties = {
  color: '#ff6b6b',
  maxWidth: '32rem',
  textAlign: 'center',
};

export function LandingPage() {
  const {
    status,
    playerName,
    starName,
    starType,
    starSystem,
    playerPosition,
    playerPlanetId,
    error,
  } = useLandingPageBootstrap();

  return (
    <div style={layoutStyle}>
      <ClientHeader playerName={playerName} starName={starName} status={status} />
      <main style={status === 'ready' ? contentStyle : centeredContentStyle}>
        {status === 'loading' && <p style={{ color: '#9a9a9a' }}>Connecting…</p>}

        {status === 'error' && (
          <>
            <p style={errorStyle} role="alert">
              {error}
            </p>
            <p>
              <a href="/stellar-gate/" style={{ color: '#7eb8ff' }}>
                Go to Stellar Gate
              </a>
            </p>
          </>
        )}

        {status === 'ready' && starSystem != null && starType != null && (
          <StarSystemMap
            starSystem={starSystem}
            starType={starType}
            playerPosition={playerPosition}
            playerPlanetId={playerPlanetId}
          />
        )}
      </main>
    </div>
  );
}
