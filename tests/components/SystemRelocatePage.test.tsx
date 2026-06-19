import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SystemRelocatePage } from '@components/SystemRelocatePage';

vi.mock('@hooks/useSystemRelocate', () => ({
  useSystemRelocate: vi.fn(),
}));

import { useSystemRelocate } from '@hooks/useSystemRelocate';

const mockedHook = vi.mocked(useSystemRelocate);

describe('SystemRelocatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading state while relocating', () => {
    mockedHook.mockReturnValue({ status: 'loading', error: null });

    render(
      <MemoryRouter initialEntries={['/system-1']}>
        <Routes>
          <Route path="/:systemId" element={<SystemRelocatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Relocating…')).toBeInTheDocument();
  });

  it('shows the error and a back link when relocation fails', () => {
    mockedHook.mockReturnValue({
      status: 'error',
      error: 'You are not allowed to travel to this star system.',
    });

    render(
      <MemoryRouter initialEntries={['/system-1']}>
        <Routes>
          <Route path="/:systemId" element={<SystemRelocatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('not allowed');
    expect(screen.getByRole('link', { name: 'Back to Solaris' })).toHaveAttribute('href', '/');
  });

  it('shows a Stellar Gate link on auth errors', () => {
    mockedHook.mockReturnValue({
      status: 'error',
      error: 'You are not signed in. Log in via Stellar Gate (/stellar-gate/).',
    });

    render(
      <MemoryRouter initialEntries={['/system-1']}>
        <Routes>
          <Route path="/:systemId" element={<SystemRelocatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Go to Stellar Gate' })).toHaveAttribute(
      'href',
      '/stellar-gate/',
    );
  });
});
