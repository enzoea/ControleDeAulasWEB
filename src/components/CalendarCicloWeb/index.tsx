'use client';
import React, { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import dayjs from 'dayjs';
import { listarLancamentosPorCiclo } from '@/data/db';
import { styles } from './styles';

type Props = { inicio: Date; fim: Date; selected: string[]; onChange: (next: string[]) => void; onDayPressOverride?: (iso: string) => void };

export default function CalendarCicloWeb({ inicio, fim, selected, onChange, onDayPressOverride }: Props) {
  const minDate = dayjs(inicio).toDate();
  const maxDate = dayjs(fim).toDate();
  const selectedDates = useMemo(() => selected.map(s => dayjs(s).toDate()), [selected]);
  const lancamentos = useMemo(() => listarLancamentosPorCiclo(dayjs(inicio).format('YYYY-MM-DD'), dayjs(fim).format('YYYY-MM-DD')), [inicio, fim]);

  const modifiers = useMemo(() => {
    const presenca = new Set<string>();
    const falta = new Set<string>();
    const substituicao = new Set<string>();
    lancamentos.forEach(l => {
      const hasP = l.manha === 'presenca' || l.tarde === 'presenca' || l.noite === 'presenca';
      const hasF = l.manha === 'falta' || l.tarde === 'falta' || l.noite === 'falta';
      const hasS = l.manha === 'substituicao' || l.tarde === 'substituicao' || l.noite === 'substituicao';
      if (hasP) presenca.add(l.dataISO);
      if (hasF) falta.add(l.dataISO);
      if (hasS) substituicao.add(l.dataISO);
    });
    return {
      presenca: (date: Date) => presenca.has(dayjs(date).format('YYYY-MM-DD')),
      falta: (date: Date) => falta.has(dayjs(date).format('YYYY-MM-DD')),
      substituicao: (date: Date) => substituicao.has(dayjs(date).format('YYYY-MM-DD')),
      weekend: (date: Date) => {
        const d = dayjs(date).day();
        return d === 0 || d === 6;
      },
      outOfRange: (date: Date) => date < minDate || date > maxDate,
    };
  }, [lancamentos, minDate, maxDate]);

  const modifiersStyles = {
    presenca: { border: '1px solid var(--primary)' },
    falta: { border: '1px solid var(--danger)' },
    substituicao: { border: '1px solid var(--success)' },
    weekend: { color: '#ccc' },
    selected: { backgroundColor: '#cfe7ff' },
  } as any;

  return (
    <div>
      <DayPicker
        mode="multiple"
        selected={selectedDates}
        onSelect={(dates) => {
          const next = (dates || []).map(d => dayjs(d).format('YYYY-MM-DD')).filter(iso => {
            const dow = dayjs(iso).day();
            return dow !== 0 && dow !== 6; // excluir finais de semana
          }).sort();
          if (onDayPressOverride && next.length === 1) onDayPressOverride(next[0]);
          else onChange(next);
        }}
        fromDate={minDate}
        toDate={maxDate}
        modifiers={modifiers as any}
        modifiersStyles={modifiersStyles}
        showOutsideDays={false}
      />
      <div className={styles.legend}>
        <div className={styles.legendItem}><span className={styles.dot} style={{ backgroundColor: 'var(--primary)' }} /> Presença</div>
        <div className={styles.legendItem}><span className={styles.dot} style={{ backgroundColor: 'var(--danger)' }} /> Falta</div>
        <div className={styles.legendItem}><span className={styles.dot} style={{ backgroundColor: 'var(--success)' }} /> Substituição</div>
      </div>
    </div>
  );
}