'use client';
import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import InlineHeader from '@components/InlineHeader';
import CalendarCicloWeb from '@components/CalendarCicloWeb';
import AppButton from '@components/AppButton';
import AppFooter from '@components/AppFooter';
import { getCicloPorOffset, metaCicloISOByOffset } from '@/core/ciclo';
import { resetStatusPorTipoNoCiclo } from '@/data/db';
import { containsWeekend } from '../../utils/date';
import { useRouter } from 'next/navigation';
import { styles } from '../styles';
import { setSelectedDays } from '../helpers/storage';

export default function SelecionarDias() {
  const router = useRouter();
  const [cicloOffset, setCicloOffset] = useState(0);
  const { inicio, fim } = useMemo(() => getCicloPorOffset(cicloOffset, new Date()), [cicloOffset]);
  const meta = useMemo(() => metaCicloISOByOffset(cicloOffset, new Date()), [cicloOffset]);
  const [selected, setSelected] = useState<string[]>([]);

  function avancar() {
    if (selected.length === 0) { alert('Selecione ao menos um dia do ciclo.'); return; }
    if (containsWeekend(selected)) { alert('Não é permitido registrar presenças aos sábados e domingos.'); return; }
    setSelectedDays(selected);
    router.push('/preenchimento-mensal/selecionar-turnos');
  }

  return (
    <div className="container">
      <InlineHeader title="Preenchimento mensal" />
      <div className="card" style={{ marginTop: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div>
          Ciclo: {dayjs(inicio).format('DD/MM/YYYY')} até {dayjs(fim).format('DD/MM/YYYY')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <AppButton label="Ciclo anterior" variant="outline" onClick={() => { setSelected([]); setCicloOffset(o => o - 1); }} />
          <AppButton label="Próximo ciclo" variant="outline" onClick={() => { setSelected([]); setCicloOffset(o => o + 1); }} />
        </div>
      </div>
      <CalendarCicloWeb
        inicio={inicio}
        fim={fim}
        selected={selected}
        onChange={setSelected}
        onDayPressOverride={(iso) => {
          const clickedDay = dayjs(iso).date();
          const targetParityEven = clickedDay % 2 === 0;
          const dias: string[] = [];
          let cur = dayjs(inicio);
          const end = dayjs(fim);
          while (cur.isBefore(end) || cur.isSame(end, 'day')) {
            const dow = cur.day();
            const parityEven = cur.date() % 2 === 0;
            if (dow !== 0 && dow !== 6 && parityEven === targetParityEven) {
              dias.push(cur.format('YYYY-MM-DD'));
            }
            cur = cur.add(1, 'day');
          }
          const unique = new Set([...selected, ...dias]);
          const nextSel = Array.from(unique).sort();
          setSelected(nextSel);
        }}
      />
      <div style={styles.actions}>
        <AppButton label="Avançar" variant="outline" onClick={avancar} />
        <AppButton label="Excluir informações" variant="danger" onClick={() => {
          const count = resetStatusPorTipoNoCiclo(meta.inicioISO, meta.fimISO, 'presenca');
          alert(`Presenças excluídas: ${count}`);
        }} />
      </div>
      <AppFooter />
    </div>
  );
}
