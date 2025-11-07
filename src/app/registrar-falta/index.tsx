'use client';
import React, { useMemo, useState } from 'react';
import InlineHeader from '@components/InlineHeader';
import CalendarCicloWeb from '@components/CalendarCicloWeb';
import DiaTurnosPickerWeb, { DiaTurnosSelection } from '@components/DiaTurnosPickerWeb';
import AppButton from '@components/AppButton';
import AppFooter from '@components/AppFooter';
import { getCicloAtual, metaCicloISO } from '@/core/ciclo';
import { aplicarStatus, findLancamentoByDataISO, resetStatusPorTipoNoCiclo } from '@/data/db';
import { containsWeekend } from '../utils/date';
import { useRouter } from 'next/navigation';
import { styles } from './styles';

export default function RegistrarFalta() {
  const router = useRouter();
  const { inicio, fim } = useMemo(() => getCicloAtual(new Date()), []);
  const meta = useMemo(() => metaCicloISO(new Date()), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<'calendar' | 'turnos'>('calendar');
  const [turnosSel, setTurnosSel] = useState<DiaTurnosSelection>({});

  function avancar() {
    if (selected.length === 0) { alert('Selecione ao menos um dia.'); return; }
    if (containsWeekend(selected)) { alert('Não é permitido registrar faltas aos sábados e domingos.'); return; }
    setStep('turnos');
  }

  function salvar() {
    const dias = selected;
    if (containsWeekend(dias)) { alert('Não é permitido registrar aos fins de semana.'); return; }
    dias.forEach(d => {
      const s = turnosSel[d] ?? { manha: false, tarde: false, noite: false };
      const turnos: ('manha' | 'tarde' | 'noite')[] = [];
      if (s.manha) turnos.push('manha');
      if (s.tarde) turnos.push('tarde');
      if (s.noite) turnos.push('noite');
      if (turnos.length > 0) {
        aplicarStatus([d], turnos as any, 'falta', meta);
      }
    });
    alert('Faltas aplicadas.');
    router.push('/');
  }

  return (
    <div className="container">
      <InlineHeader title="Registrar falta" />
      {step === 'calendar' && (
        <>
          <CalendarCicloWeb inicio={inicio} fim={fim} selected={selected} onChange={setSelected} />
          <div style={styles.actions}>
            <AppButton label="Avançar" variant="outline" onClick={avancar} />
            <AppButton label="Excluir faltas" variant="danger" onClick={() => {
              const count = resetStatusPorTipoNoCiclo(meta.inicioISO, meta.fimISO, 'falta');
              alert(`Faltas excluídas: ${count}`);
            }} />
          </div>
        </>
      )}
      {step === 'turnos' && (
        <>
          <DiaTurnosPickerWeb diasISO={selected} value={turnosSel} onChange={setTurnosSel} />
          <div style={styles.actions}>
            <AppButton label="Salvar" onClick={salvar} />
            <AppButton label="Voltar" variant="outline" onClick={() => setStep('calendar')} />
          </div>
        </>
      )}
      <AppFooter />
    </div>
  );
}