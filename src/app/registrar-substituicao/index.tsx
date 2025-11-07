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

export default function RegistrarSubstituicao() {
  const router = useRouter();
  const { inicio, fim } = useMemo(() => getCicloAtual(new Date()), []);
  const meta = useMemo(() => metaCicloISO(new Date()), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<'calendar' | 'turnos'>('calendar');
  const [turnosSel, setTurnosSel] = useState<DiaTurnosSelection>({});
  const [substituidoPor, setSubstituidoPor] = useState('');
  const [observacoes, setObservacoes] = useState('');

  function avancar() {
    if (selected.length === 0) { alert('Selecione ao menos um dia.'); return; }
    if (containsWeekend(selected)) { alert('Não é permitido registrar substituições aos sábados e domingos.'); return; }
    setStep('turnos');
  }

  function salvar() {
    const dias = selected;
    if (containsWeekend(dias)) { alert('Não é permitido registrar aos fins de semana.'); return; }
    let hasConflict = false;
    dias.forEach(d => {
      const s = turnosSel[d] ?? { manha: false, tarde: false, noite: false };
      const l = findLancamentoByDataISO(d);
      if (l) {
        (['manha','tarde','noite'] as const).forEach(t => { if ((s as any)[t] && l[t] && l[t] !== 'substituicao') hasConflict = true; });
      }
    });
    if (hasConflict) { alert('Conflito: já existe presença/falta para algum turno selecionado.'); return; }
    dias.forEach(d => {
      const s = turnosSel[d] ?? { manha: false, tarde: false, noite: false };
      const turnos: ('manha' | 'tarde' | 'noite')[] = [];
      if (s.manha) turnos.push('manha');
      if (s.tarde) turnos.push('tarde');
      if (s.noite) turnos.push('noite');
      if (turnos.length > 0) {
        aplicarStatus([d], turnos as any, 'substituicao', meta, { substituidoPor, observacoes });
      }
    });
    alert('Substituições aplicadas.');
    router.push('/');
  }

  return (
    <div className="container">
      <InlineHeader title="Registrar substituição" />
      {step === 'calendar' && (
        <>
          <CalendarCicloWeb inicio={inicio} fim={fim} selected={selected} onChange={setSelected} />
          <div className="card" style={{ marginTop: 12 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <label>
                Nome do substituto:
                <input value={substituidoPor} onChange={(e) => setSubstituidoPor(e.target.value)} placeholder="Professor(a)" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
              </label>
              <label>
                Observações:
                <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Ex.: motivos, turma..." rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
              </label>
            </div>
          </div>
          <div style={styles.actions}>
            <AppButton label="Avançar" variant="outline" onClick={avancar} />
            <AppButton label="Excluir substituições" variant="danger" onClick={() => {
              const count = resetStatusPorTipoNoCiclo(meta.inicioISO, meta.fimISO, 'substituicao');
              alert(`Substituições excluídas: ${count}`);
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