"use client";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import type { Lancamento } from "@/core/types";

function statusToCell(status: string | null | undefined, obs?: string | null | undefined): string {
  switch (status) {
    case "presenca":
      return (obs && obs.trim().length > 0) ? obs.trim() : "✔️";
    case "falta":
      return "Falta";
    case "substituicao":
      return "Substituição";
    default:
      return "";
  }
}

export function exportCicloPDF(nome: string, inicioISO: string, fimISO: string, lancamentos: Lancamento[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const marginLeft = 14;
  const marginRight = 14;
  const marginTop = 18;
  const marginBottom = 18;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const tableWidth = pageWidth - marginLeft - marginRight;

  const headers = ["Data", "Manhã", "Tarde", "Noite"];
  const colWidths = [30, 50, 50, tableWidth - (30 + 50 + 50)];
  const cellPadding = 2;
  const headerHeight = 8;

  doc.setFontSize(14);
  doc.text(`${nome || "Relatório"} - ${dayjs(inicioISO).format("DD/MM")} a ${dayjs(fimISO).format("DD/MM")}`, marginLeft, marginTop);
  doc.setFontSize(10);

  let cursorY = marginTop + 8;

  doc.setFillColor(245, 245, 245);
  doc.rect(marginLeft, cursorY, tableWidth, headerHeight, "F");
  doc.setFont("helvetica", "bold");

  let cursorX = marginLeft;
  headers.forEach((h, i) => {
    doc.text(h, cursorX + cellPadding, cursorY + headerHeight - cellPadding - 1);
    cursorX += colWidths[i];
  });

  doc.setFont("helvetica", "normal");

  const days: string[] = [];
  let cur = dayjs(inicioISO);
  const end = dayjs(fimISO);
  while (cur.isBefore(end) || cur.isSame(end, "day")) {
    days.push(cur.format("YYYY-MM-DD"));
    cur = cur.add(1, "day");
  }

  const map = new Map<string, Lancamento>();
  lancamentos.forEach((l) => map.set(l.dataISO, l));

  cursorY += headerHeight;

  for (const d of days) {
    const l = map.get(d);
    const row = [
      dayjs(d).format("DD/MM/YYYY"),
      statusToCell(l?.manha ?? null, l?.observacoesManha ?? l?.observacoes),
      statusToCell(l?.tarde ?? null, l?.observacoesTarde ?? l?.observacoes),
      statusToCell(l?.noite ?? null, l?.observacoesNoite ?? l?.observacoes),
    ];

    const wrappedCells = row.map((text, i) => doc.splitTextToSize(text || "", colWidths[i] - cellPadding * 2));
    const lineHeight = 4;
    const rowHeight = Math.max(...wrappedCells.map((lines) => Math.max(lines.length, 1))) * lineHeight + cellPadding * 2;

    if (cursorY + rowHeight > pageHeight - marginBottom) {
      doc.addPage();
      cursorY = marginTop;
    }

    cursorX = marginLeft;
    for (let i = 0; i < headers.length; i++) {
      const cellWidth = colWidths[i];
      doc.rect(cursorX, cursorY, cellWidth, rowHeight);
      const lines = wrappedCells[i];
      for (let li = 0; li < lines.length; li++) {
        const ty = cursorY + cellPadding + (li + 1) * lineHeight - 1;
        doc.text(lines[li], cursorX + cellPadding, ty);
      }
      cursorX += cellWidth;
    }
    cursorY += rowHeight;
  }

  doc.save(`${nome || "Relatorio"}_${dayjs(inicioISO).format("DDMM")}-${dayjs(fimISO).format("DDMM")}.pdf`);
}