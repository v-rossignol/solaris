import type { CSSProperties } from 'react';
import landingBackground from '../assets/images/solaris-1.avif';

export const pageBackgroundStyle: CSSProperties = {
  backgroundColor: '#0f0f0f',
  backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.55), rgba(15, 15, 15, 0.55)), url(${landingBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};
