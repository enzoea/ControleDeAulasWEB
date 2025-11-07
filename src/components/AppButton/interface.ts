import type { CSSProperties } from 'react';

export type Props = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
  style?: CSSProperties;
};