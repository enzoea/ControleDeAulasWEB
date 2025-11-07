'use client';
import React, { useEffect, useMemo, useState } from 'react';
import InlineHeader from '@components/InlineHeader';
import ActionCard from '@components/ActionCard';
import AppFooter from '@components/AppFooter';
import { metaCicloISO } from '@/core/ciclo';
import { listarLancamentosPorCiclo, resetLancamentosPorCiclo } from '@/data/db';
import { sumarizarLancamentos } from '../utils/lancamentos';

export default function Home() {
  const meta = useMemo(() => metaCicloISO(new Date()), []);
  const [refresh, setRefresh] = useState(0);
  const [lancamentos, setLancamentos] = useState(() => [] as ReturnType<typeof listarLancamentosPorCiclo>);
  useEffect(() => {
    // Carrega dados do localStorage no cliente após hidratação, evitando mismatch com SSR
    const items = listarLancamentosPorCiclo(meta.inicioISO, meta.fimISO);
    setLancamentos(items);
  }, [meta.inicioISO, meta.fimISO, refresh]);
  const totals = useMemo(() => sumarizarLancamentos(lancamentos), [lancamentos]);

  return (
    <div className="container">
      <InlineHeader title="Controle de aulas - Mensal" />
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="title">Estatísticas do ciclo</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>Aulas (presenças): <b>{totals.presenca}</b></div>
          <div>Faltas: <b style={{ color: 'var(--danger)' }}>{totals.falta}</b></div>
          <div>Substituições: <b style={{ color: 'var(--success)' }}>{totals.substituicao}</b></div>
          <div>Horas: <b>{totals.horas}h</b></div>
        </div>
      </div>
      <div className="row">
        <ActionCard href="/preenchimento-mensal/selecionar-dias" label="Preenchimento mensal" icon="🗓️" />
        <ActionCard href="/registrar-falta" label="Registrar falta" icon="⛔" />
        <ActionCard href="/registrar-substituicao" label="Registrar substituição" icon="🔄" />
        <ActionCard href="/verificar-informacoes" label="Verificar informações" icon="📋" />
        <ActionCard href="/estimativa-salario" label="Estimativa de salário" icon="💰" fullWidth />
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-danger" onClick={() => {
          const count = resetLancamentosPorCiclo(meta.inicioISO, meta.fimISO);
          alert(`Informações removidas: ${count}`);
          setRefresh(x => x + 1);
        }}>Excluir informações do ciclo</button>
      </div>
      <AppFooter />
    </div>
  );
}