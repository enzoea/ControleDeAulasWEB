'use client';
import React, { useMemo } from 'react';
import InlineHeader from '@components/InlineHeader';
import AppFooter from '@components/AppFooter';
import { metaCicloISO } from '@/core/ciclo';
import { listarLancamentosPorCiclo } from '@/data/db';
import { sumarizarLancamentos } from '../utils/lancamentos';
import { calcularLiquido, formatBRL } from '../utils/salario';

export default function EstimativaSalario() {
  const meta = useMemo(() => metaCicloISO(new Date()), []);
  const lancamentos = useMemo(() => listarLancamentosPorCiclo(meta.inicioISO, meta.fimISO), [meta.inicioISO, meta.fimISO]);
  const totals = useMemo(() => sumarizarLancamentos(lancamentos), [lancamentos]);
  const VALOR_HORA = 48.65;
  const salario = useMemo(() => calcularLiquido(totals.horas, VALOR_HORA), [totals.horas]);

  return (
    <div className="container">
      <InlineHeader title="Estimativa de salário" />
      <div className="card">
        <div className="title">Resumo do período</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>Horas lecionadas: <b>{totals.horas}h</b></div>
          <div>Salário bruto: <b>{formatBRL(salario.bruto)}</b></div>
          <div>INSS ({Math.round(salario.aliquotaINSS * 100)}%): <b style={{ color: '#FF9500' }}>{formatBRL(salario.inss)}</b></div>
          <div>Base IRRF: <b>{formatBRL(salario.baseIRRF)}</b></div>
          <div>IRRF ({Math.round(salario.aliquotaIRRF * 100)}%): <b style={{ color: '#FF3B30' }}>{formatBRL(salario.irrf)}</b></div>
          <div>Salário líquido: <b>{formatBRL(salario.liquido)}</b></div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}