'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import type { Turno } from '@/core/types';
import type { DiaTurnosSelection, Props } from './interface';
import { classes } from './styles';

export default function DiaTurnosPickerWeb({ diasISO, value, onChange, turmas, onChangeTurmas, propagateParity = true }: Props) {
  const [turmaInput, setTurmaInput] = useState('');

  function setTurno(dataISO: string, turno: Turno, val: boolean) {
    const base = value[dataISO] ?? { manha: false, tarde: false, noite: false };
    const next = { ...value, [dataISO]: { ...base, [turno]: val } } as DiaTurnosSelection;
    onChange(next);
    if (val) {
      const prefill = (turmas?.[dataISO] as any)?.[turno] ?? '';
      setTurmaInput(prefill);
    }
  }

  function setTurma(dataISO: string, turno: Turno, nome: string) {
    const base = turmas?.[dataISO] ?? {};
    let next = { ...(turmas ?? {}) } as Record<string, { manha?: string; tarde?: string; noite?: string }>;
    let nextSel = { ...value } as DiaTurnosSelection;
    const clickedDay = dayjs(dataISO).date();
    const targetParityEven = (clickedDay % 2) === 0;
    if (propagateParity) {
      diasISO.forEach(d => {
        const isEven = (dayjs(d).date() % 2) === 0;
        if (isEven === targetParityEven) {
          const curBase = next[d] ?? {};
          next[d] = { ...curBase, [turno]: nome };
          const curSel = nextSel[d] ?? { manha: false, tarde: false, noite: false };
          nextSel[d] = { ...curSel, [turno]: true };
        }
      });
    } else {
      next[dataISO] = { ...base, [turno]: nome };
      const curSel = nextSel[dataISO] ?? { manha: false, tarde: false, noite: false };
      nextSel[dataISO] = { ...curSel, [turno]: true };
    }
    onChangeTurmas?.(next);
    onChange(nextSel);
  }

  return (
    <div className={classes.card}>
      <div className={classes.gridTwo}>
        {diasISO.map(d => {
          const s = value[d] ?? { manha: false, tarde: false, noite: false };
          const obs = turmas?.[d] ?? {};
          return (
            <div key={d}>
              <div className="muted" style={{ marginBottom: 6 }}>{dayjs(d).format('DD/MM/YYYY')}</div>
              {(['manha','tarde','noite'] as const).map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <input type="checkbox" checked={(s as any)[t]} onChange={(e) => setTurno(d, t, e.target.checked)} />
                  <label style={{ width: 64, textTransform: 'capitalize' }}>{t}</label>
                  <input
                    value={(obs as any)[t] ?? ''}
                    onChange={(e) => setTurma(d, t, e.target.value)}
                    placeholder={`Turma/Obs ${t}`}
                    style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ddd' }}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { DiaTurnosSelection } from './interface';