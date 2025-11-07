'use client';
import React, { useMemo, useState } from 'react';
import InlineHeader from '@components/InlineHeader';
import DiaTurnosPickerWeb, { DiaTurnosSelection } from '@components/DiaTurnosPickerWeb';
import AppButton from '@components/AppButton';
import AppFooter from '@components/AppFooter';
import { metaCicloISO } from '@/core/ciclo';
import { aplicarPresencas } from '@/data/db';
import { useRouter } from 'next/navigation';
import { styles } from '../styles';
import { getSelectedDays, clearSelectedDays } from '../helpers/storage';

export default function SelecionarTurnos() {
  const router = useRouter();
  const meta = useMemo(() => metaCicloISO(new Date()), []);
  const [selected] = useState<string[]>(() => getSelectedDays());
  const [turnosSel, setTurnosSel] = useState<DiaTurnosSelection>({});
  const [turmasPorTurno, setTurmasPorTurno] = useState<Record<string, { manha?: string; tarde?: string; noite?: string }>>({});

  function salvar() {
    if (selected.length === 0) {
      alert('Nenhum dia selecionado. Volte e selecione dias.');
      router.push('/preenchimento-mensal/selecionar-dias');
      return;
    }
    let aplicados = 0;
    selected.forEach(d => {
      const s = turnosSel[d] ?? { manha: false, tarde: false, noite: false };
      const turnos: ('manha' | 'tarde' | 'noite')[] = [];
      if (s.manha) turnos.push('manha');
      if (s.tarde) turnos.push('tarde');
      if (s.noite) turnos.push('noite');
      if (turnos.length > 0) {
        const obsPT = turmasPorTurno[d] ?? {};
        aplicarPresencas([d], turnos as any, meta, {
          observacoesPorTurno: {
            manha: obsPT.manha?.trim() || undefined,
            tarde: obsPT.tarde?.trim() || undefined,
            noite: obsPT.noite?.trim() || undefined,
          },
        });
        aplicados++;
      }
    });
    if (aplicados === 0) { alert('Marque ao menos um turno para algum dia.'); return; }
    alert('Presenças aplicadas.');
    clearSelectedDays();
    router.push('/');
  }

  return (
    <div className="container">
      <InlineHeader title="Preenchimento mensal" />
      <DiaTurnosPickerWeb diasISO={selected} value={turnosSel} onChange={setTurnosSel} turmas={turmasPorTurno} onChangeTurmas={setTurmasPorTurno} />
      <div style={styles.actions}>
        <AppButton label="Salvar" onClick={salvar} />
        <AppButton label="Voltar" variant="outline" onClick={() => router.push('/preenchimento-mensal/selecionar-dias')} />
      </div>
      <AppFooter />
    </div>
  );
}