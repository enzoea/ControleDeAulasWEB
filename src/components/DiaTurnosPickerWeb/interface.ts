import type { Turno } from '@/core/types';

export type SelecoesDia = { manha: boolean; tarde: boolean; noite: boolean };
export type DiaTurnosSelection = Record<string, SelecoesDia>;

export type Props = {
  diasISO: string[];
  value: DiaTurnosSelection;
  onChange: (next: DiaTurnosSelection) => void;
  turmas?: Record<string, { manha?: string; tarde?: string; noite?: string }>;
  onChangeTurmas?: (next: Record<string, { manha?: string; tarde?: string; noite?: string }>) => void;
  propagateParity?: boolean;
};