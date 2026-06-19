interface ClientHeaderProps {
  playerName?: string | null;
  starName?: string | null;
  status?: 'loading' | 'ready' | 'error';
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: '3rem',
  padding: '0 1.25rem',
  borderBottom: '1px solid #2a2a2a',
  backgroundColor: '#141414',
  color: '#f0f0f0',
  fontFamily: 'system-ui, sans-serif',
  fontSize: '0.9375rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const labelStyle: React.CSSProperties = {
  color: '#9a9a9a',
  marginRight: '0.35rem',
};

const separatorStyle: React.CSSProperties = {
  color: '#5a5a5a',
  margin: '0 0.75rem',
};

export function ClientHeader({ playerName, starName, status = 'ready' }: ClientHeaderProps) {
  const showContext = status === 'ready' && playerName && starName;

  return (
    <header style={headerStyle}>
      <span style={{ fontWeight: 600, marginRight: '1rem' }}>Solaris</span>
      {showContext ? (
        <span>
          <span>
            <span style={labelStyle}>Player</span>
            {playerName}
          </span>
          <span style={separatorStyle} aria-hidden="true">
            ·
          </span>
          <span>
            <span style={labelStyle}>Star</span>
            {starName}
          </span>
        </span>
      ) : status === 'loading' ? (
        <span style={{ color: '#9a9a9a' }}>Loading…</span>
      ) : null}
    </header>
  );
}
