import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');

export function getCicloAtual(base: Date = new Date()) {
  const ano = base.getFullYear();
  const mes = base.getMonth();
  const dia = base.getDate();
  if (dia >= 16) {
    const inicio = new Date(ano, mes, 16, 0, 0, 0);
    const fim = new Date(ano, mes + 1, 15, 23, 59, 59);
    return { inicio, fim };
  } else {
    const inicio = new Date(ano, mes - 1, 16, 0, 0, 0);
    const fim = new Date(ano, mes, 15, 23, 59, 59);
    return { inicio, fim };
  }
}

export function toISO(date: Date): string {
  return dayjs(date).tz().format('YYYY-MM-DD');
}

export function metaCicloISO(base: Date = new Date()) {
  const { inicio, fim } = getCicloAtual(base);
  return { inicioISO: toISO(inicio), fimISO: toISO(fim) };
}

// Permite obter ciclos relativos ao atual: offset 0 = atual, -1 = anterior, +1 = próximo
export function getCicloPorOffset(offset: number, base: Date = new Date()) {
  const { inicio, fim } = getCicloAtual(base);
  const inicio2 = dayjs(inicio).tz().add(offset, 'month').toDate();
  const fim2 = dayjs(fim).tz().add(offset, 'month').toDate();
  return { inicio: inicio2, fim: fim2 };
}

export function metaCicloISOByOffset(offset: number, base: Date = new Date()) {
  const { inicio, fim } = getCicloPorOffset(offset, base);
  return { inicioISO: toISO(inicio), fimISO: toISO(fim) };
}

export function listarDiasNoCiclo(inicio: Date, fim: Date): string[] {
  const start = dayjs(inicio).tz().startOf('day');
  const end = dayjs(fim).tz().startOf('day');
  const dias: string[] = [];
  let cur = start;
  while (cur.isBefore(end) || cur.isSame(end, 'day')) {
    dias.push(cur.format('YYYY-MM-DD'));
    cur = cur.add(1, 'day');
  }
  return dias;
}
