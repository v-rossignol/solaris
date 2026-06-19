import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playerService } from '../services/playerService';
import { getRelocateErrorMessage } from '../utils/relocateErrors';

export type SystemRelocateStatus = 'loading' | 'error';

export interface SystemRelocateState {
  status: SystemRelocateStatus;
  error: string | null;
}

export const useSystemRelocate = (systemId: string | undefined): SystemRelocateState => {
  const navigate = useNavigate();
  const [state, setState] = useState<SystemRelocateState>({
    status: 'loading',
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const trimmedSystemId = systemId?.trim();

    if (!trimmedSystemId) {
      setState({
        status: 'error',
        error: 'Missing star system id.',
      });
      return;
    }

    const relocate = async () => {
      try {
        await playerService.relocateToStarSystem(trimmedSystemId);
        if (cancelled) {
          return;
        }

        navigate('/', { replace: true });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          status: 'error',
          error: getRelocateErrorMessage(error),
        });
      }
    };

    void relocate();

    return () => {
      cancelled = true;
    };
  }, [navigate, systemId]);

  return state;
};
