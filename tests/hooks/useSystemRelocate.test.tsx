import { renderHook, waitFor } from '@testing-library/react';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { useSystemRelocate } from '@hooks/useSystemRelocate';
import { playerService } from '@services/playerService';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@services/playerService', () => ({
  playerService: {
    relocateToStarSystem: vi.fn(),
  },
}));

const mockedPlayer = vi.mocked(playerService);

const createAxiosError = (status: number, message: string): AxiosError => {
  const error = new AxiosError('Request failed', String(status));
  error.response = {
    data: { message },
    status,
    statusText: 'Error',
    headers: {},
    config: { headers: new axios.AxiosHeaders() } as InternalAxiosRequestConfig,
  };
  return error;
};

const wrapper =
  () =>
  ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

describe('useSystemRelocate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to the landing page after a successful relocate', async () => {
    mockedPlayer.relocateToStarSystem.mockResolvedValue({
      player: {
        id: 'player-1',
        userId: 'user-1',
        location: {
          cube: { id: 'cube-1' },
          starSystem: { id: 'system-1', position: { x: 0, y: 0 } },
        },
        createdAt: '2026-06-11T12:00:00.000Z',
        updatedAt: '2026-06-11T12:05:00.000Z',
      },
    });

    const { result } = renderHook(() => useSystemRelocate('system-1'), { wrapper: wrapper() });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });

    expect(mockedPlayer.relocateToStarSystem).toHaveBeenCalledWith('system-1');
    expect(result.current.status).toBe('loading');
  });

  it('returns an error when relocation fails', async () => {
    mockedPlayer.relocateToStarSystem.mockRejectedValue(createAxiosError(404, 'Star missing'));

    const { result } = renderHook(() => useSystemRelocate('missing-system'), {
      wrapper: wrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toBe('Star missing');
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('returns an error when the system id is missing', async () => {
    const { result } = renderHook(() => useSystemRelocate('   '), { wrapper: wrapper() });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toBe('Missing star system id.');
    expect(mockedPlayer.relocateToStarSystem).not.toHaveBeenCalled();
  });
});
