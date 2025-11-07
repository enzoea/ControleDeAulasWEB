export type Turno = 'manha' | 'tarde' | 'noite';
export type StatusTurno = 'presenca' | 'falta' | 'substituicao' | null;

export type Lancamento = {
  id: string;
  dataISO: string;
  cicloInicioISO: string;
  cicloFimISO: string;
  manha: StatusTurno;
  tarde: StatusTurno;
  noite: StatusTurno;
  substituidoPor?: string;
  observacoes?: string;
  observacoesManha?: string;
  observacoesTarde?: string;
  observacoesNoite?: string;
  createdAt: number;
  updatedAt: number;
};

export type MetaCicloISO = { inicioISO: string; fimISO: string };