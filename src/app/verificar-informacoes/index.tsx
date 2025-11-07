'use client';
import React, { useMemo, useState } from 'react';
import InlineHeader from '@components/InlineHeader';
import AppFooter from '@components/AppFooter';
import TabelaCicloWeb from '@components/TabelaCicloWeb';
import { metaCicloISO } from '@/core/ciclo';
import { listarLancamentosPorCiclo } from '@/data/db';
import { exportCicloPDF } from '@/data/exportPdf';
import { exportCicloXLSX } from '@/data/exportExcel';

export default function VerificarInformacoes() {
  const meta = useMemo(() => metaCicloISO(new Date()), []);
  const [refresh, setRefresh] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const lancamentos = useMemo(() => listarLancamentosPorCiclo(meta.inicioISO, meta.fimISO), [refresh, meta.inicioISO, meta.fimISO]);

  return (
    <div className="container">
      <InlineHeader title="Verificar informações" />
      <div className="card" style={{ marginBottom: 12 }}>
        <TabelaCicloWeb inicioISO={meta.inicioISO} fimISO={meta.fimISO} lancamentos={lancamentos} />
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="title">Exportar</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} placeholder="Seu nome" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', flex: 1 }} />
          <button className="btn btn-outline" onClick={() => exportCicloXLSX(nomeUsuario, meta.inicioISO, meta.fimISO, lancamentos)}>Exportar XLSX</button>
          <button className="btn btn-outline" onClick={() => exportCicloPDF(nomeUsuario, meta.inicioISO, meta.fimISO, lancamentos)}>Exportar PDF</button>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}