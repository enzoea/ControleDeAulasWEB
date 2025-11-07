'use client';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import type { Lancamento, MetaCicloISO, Turno } from '@/core/types';

const STORAGE_KEY = 'controle-ponto-lancamentos';

function readAll(): Lancamento[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Lancamento[]; } catch { return []; }
}

function writeAll(items: Lancamento[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listarLancamentosPorCiclo(inicioISO: string, fimISO: string): Lancamento[] {
  const items = readAll();
  return items.filter(l => l.dataISO >= inicioISO && l.dataISO <= fimISO).sort((a,b) => a.dataISO.localeCompare(b.dataISO));
}

export function findLancamentoByDataISO(dataISO: string): Lancamento | undefined {
  return readAll().find(l => l.dataISO === dataISO);
}

export function upsertLancamento(lanc: Omit<Lancamento, 'id' | 'createdAt' | 'updatedAt'> | Lancamento): Lancamento {
  const items = readAll();
  const existingIdx = items.findIndex(i => i.dataISO === (lanc as Lancamento).dataISO);
  const now = Date.now();
  if (existingIdx >= 0) {
    const merged: Lancamento = { ...items[existingIdx], ...(lanc as any), updatedAt: now };
    items[existingIdx] = merged;
    writeAll(items);
    return merged;
  } else {
    const created: Lancamento = { id: uuidv4(), createdAt: now, updatedAt: now, manha: null, tarde: null, noite: null, ...(lanc as any) };
    items.push(created);
    writeAll(items);
    return created;
  }
}

function isWeekend(dateISO: string): boolean {
  const d = dayjs(dateISO);
  const dow = d.day();
  return dow === 0 || dow === 6;
}

export function aplicarPresencas(
  diasISO: string[],
  turnos: Turno[],
  metaCiclo: MetaCicloISO,
  opts?: { observacoes?: string; observacoesPorTurno?: { manha?: string; tarde?: string; noite?: string } }
) {
  diasISO.forEach((dataISO) => {
    if (isWeekend(dataISO)) return;
    const existing = findLancamentoByDataISO(dataISO);
    const base: Omit<Lancamento, 'id' | 'createdAt' | 'updatedAt'> = {
      dataISO,
      cicloInicioISO: metaCiclo.inicioISO,
      cicloFimISO: metaCiclo.fimISO,
      manha: null,
      tarde: null,
      noite: null,
    };
    const lanc: Omit<Lancamento, 'id' | 'createdAt' | 'updatedAt'> | Lancamento = existing ? { ...existing } : base;
    // Só marca presença nos turnos selecionados, preservando os demais turnos do dia
    turnos.forEach((t) => { if (!(lanc as any)[t]) (lanc as any)[t] = 'presenca'; });
    if (opts?.observacoes) (lanc as any).observacoes = opts.observacoes;
    if (opts?.observacoesPorTurno) {
      const o = opts.observacoesPorTurno;
      if (turnos.includes('manha') && o.manha !== undefined) (lanc as any).observacoesManha = o.manha;
      if (turnos.includes('tarde') && o.tarde !== undefined) (lanc as any).observacoesTarde = o.tarde;
      if (turnos.includes('noite') && o.noite !== undefined) (lanc as any).observacoesNoite = o.noite;
    }
    upsertLancamento(lanc);
  });
}

export function aplicarStatus(
  diasISO: string[],
  turnos: Turno[],
  status: 'falta' | 'substituicao',
  metaCiclo: MetaCicloISO,
  opts?: { substituidoPor?: string; observacoes?: string; observacoesPorTurno?: { manha?: string; tarde?: string; noite?: string } }
) {
  diasISO.forEach((dataISO) => {
    if (isWeekend(dataISO)) return;
    const existing = findLancamentoByDataISO(dataISO);
    const base: Omit<Lancamento, 'id' | 'createdAt' | 'updatedAt'> = {
      dataISO,
      cicloInicioISO: metaCiclo.inicioISO,
      cicloFimISO: metaCiclo.fimISO,
      manha: null,
      tarde: null,
      noite: null,
    };
    const lanc: Omit<Lancamento, 'id' | 'createdAt' | 'updatedAt'> | Lancamento = existing ? { ...existing } : base;
    // Atualiza apenas os turnos informados, preservando os demais
    turnos.forEach((t) => { (lanc as any)[t] = status; });
    if (opts?.substituidoPor) (lanc as any).substituidoPor = opts.substituidoPor;
    if (opts?.observacoes) (lanc as any).observacoes = opts.observacoes;
    if (opts?.observacoesPorTurno) {
      const o = opts.observacoesPorTurno;
      if (turnos.includes('manha') && o.manha !== undefined) (lanc as any).observacoesManha = o.manha;
      if (turnos.includes('tarde') && o.tarde !== undefined) (lanc as any).observacoesTarde = o.tarde;
      if (turnos.includes('noite') && o.noite !== undefined) (lanc as any).observacoesNoite = o.noite;
    }
    upsertLancamento(lanc);
  });
}

export function resetStatusPorTipoNoCiclo(
  inicioISO: string,
  fimISO: string,
  tipo: 'presenca' | 'falta' | 'substituicao'
) {
  const items = readAll();
  const affected = items.filter(l => l.dataISO >= inicioISO && l.dataISO <= fimISO);
  affected.forEach(l => {
    (['manha','tarde','noite'] as const).forEach(t => {
      if ((l as any)[t] === tipo) (l as any)[t] = null;
    });
  });
  writeAll(items);
  return affected.length;
}

export function resetLancamentosPorCiclo(inicioISO: string, fimISO: string): number {
  const items = readAll();
  const next = items.filter(l => !(l.dataISO >= inicioISO && l.dataISO <= fimISO));
  const removed = items.length - next.length;
  writeAll(next);
  return removed;
}