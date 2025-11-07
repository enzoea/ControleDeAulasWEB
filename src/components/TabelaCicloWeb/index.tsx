'use client';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import type { Lancamento } from '@/core/types';
import { classes } from './styles';

function statusCell(s: string | null | undefined, obs?: string | null | undefined) {
  switch (s) {
    case 'presenca':
      return (obs && obs.trim().length > 0) ? obs.trim() : '✔️';
    case 'falta':
      return 'FALTA';
    case 'substituicao':
      return 'Substituição';
    default:
      return '';
  }
}

export default function TabelaCicloWeb({ inicioISO, fimISO, lancamentos }: { inicioISO: string; fimISO: string; lancamentos: Lancamento[] }) {
  const days = useMemo(() => {
    const d: string[] = [];
    let cur = dayjs(inicioISO);
    const end = dayjs(fimISO);
    while (cur.isBefore(end) || cur.isSame(end, 'day')) { d.push(cur.format('YYYY-MM-DD')); cur = cur.add(1, 'day'); }
    return d;
  }, [inicioISO, fimISO]);

  const map = useMemo(() => {
    const m = new Map<string, Lancamento>();
    lancamentos.forEach(l => m.set(l.dataISO, l));
    return m;
  }, [lancamentos]);

  const totals = useMemo(() => {
    let presenca = 0, falta = 0, substituicao = 0;
    days.forEach(d => {
      const l = map.get(d);
      ['manha','tarde','noite'].forEach((t) => {
        const s = (l as any)?.[t] ?? null;
        if (s === 'presenca') presenca++;
        else if (s === 'falta') falta++;
        else if (s === 'substituicao') substituicao++;
      });
    });
    return { presenca, falta, substituicao };
  }, [days, map]);

  return (
    <div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Manhã</th>
            <th>Tarde</th>
            <th>Noite</th>
          </tr>
        </thead>
        <tbody>
          {days.map(d => {
            const l = map.get(d);
            return (
              <tr key={d}>
                <td>{dayjs(d).format('DD/MM/YYYY')}</td>
                <td className={l?.manha === 'falta' ? classes.faltaCell : ''}>{l?.manha === 'falta' ? 'FALTA' : statusCell(l?.manha ?? null, l?.observacoesManha ?? l?.observacoes)}</td>
                <td className={l?.tarde === 'falta' ? classes.faltaCell : ''}>{l?.tarde === 'falta' ? 'FALTA' : statusCell(l?.tarde ?? null, l?.observacoesTarde ?? l?.observacoes)}</td>
                <td className={l?.noite === 'falta' ? classes.faltaCell : ''}>{l?.noite === 'falta' ? 'FALTA' : statusCell(l?.noite ?? null, l?.observacoesNoite ?? l?.observacoes)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <span>Total ✔️: {totals.presenca}</span>
        <span>Total Falta: {totals.falta}</span>
        <span>Total Substituição: {totals.substituicao}</span>
      </div>
    </div>
  );
}