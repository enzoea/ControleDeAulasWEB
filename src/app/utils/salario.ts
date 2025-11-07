export type Breakdown = {
  bruto: number;
  inss: number;
  irrf: number;
  liquido: number;
  aliquotaINSS: number;
  aliquotaIRRF: number;
  baseIRRF: number;
};

function round2(n: number): number { return Math.round(n * 100) / 100; }

export function calcularBruto(horas: number, valorHora: number): number {
  return round2(horas * valorHora);
}

export function calcularLiquido(horas: number, valorHora: number): Breakdown {
  const bruto = calcularBruto(horas, valorHora);
  // INSS 2025 simplificado (faixas aproximadas)
  let aliquotaINSS = 0.11;
  if (bruto <= 1500) aliquotaINSS = 0.075;
  else if (bruto <= 2666.68) aliquotaINSS = 0.09;
  else if (bruto <= 4000) aliquotaINSS = 0.12;
  const inss = round2(bruto * aliquotaINSS);
  const baseIRRF = bruto - inss - 189.59; // dedução simplificada
  let aliquotaIRRF = 0;
  if (baseIRRF <= 2112) aliquotaIRRF = 0;
  else if (baseIRRF <= 2826.65) aliquotaIRRF = 0.075;
  else if (baseIRRF <= 3751.05) aliquotaIRRF = 0.15;
  else if (baseIRRF <= 4664.68) aliquotaIRRF = 0.225;
  else aliquotaIRRF = 0.275;
  const irrf = round2(Math.max(0, baseIRRF) * aliquotaIRRF);
  const liquido = round2(bruto - inss - irrf);
  return { bruto, inss, irrf, liquido, aliquotaINSS, aliquotaIRRF, baseIRRF };
}

export function formatBRL(n: number): string {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}