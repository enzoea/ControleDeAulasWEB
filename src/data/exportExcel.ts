'use client';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import type { Lancamento } from '@/core/types';

function statusToCell(status: string | null | undefined, obs?: string | null | undefined): string {
  switch (status) {
    case 'presenca':
      return (obs && obs.trim().length > 0) ? obs.trim() : '✔️';
    case 'falta':
      return 'Falta';
    case 'substituicao':
      return 'Substituição';
    default:
      return '';
  }
}

export function exportCicloXLSX(nome: string, inicioISO: string, fimISO: string, lancamentos: Lancamento[]) {
  const days: string[] = [];
  let cur = dayjs(inicioISO);
  const end = dayjs(fimISO);
  while (cur.isBefore(end) || cur.isSame(end, 'day')) {
    days.push(cur.format('YYYY-MM-DD'));
    cur = cur.add(1, 'day');
  }
  const map = new Map<string, Lancamento>();
  lancamentos.forEach(l => map.set(l.dataISO, l));
  const rows = days.map(d => {
    const l = map.get(d);
    return {
      Data: dayjs(d).format('DD/MM/YYYY'),
      Manhã: statusToCell(l?.manha ?? null, l?.observacoesManha ?? l?.observacoes),
      Tarde: statusToCell(l?.tarde ?? null, l?.observacoesTarde ?? l?.observacoes),
      Noite: statusToCell(l?.noite ?? null, l?.observacoesNoite ?? l?.observacoes),
    };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ciclo');
  const fileName = `${nome || 'Relatorio'}_${dayjs(inicioISO).format('DDMM')}-${dayjs(fimISO).format('DDMM')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}