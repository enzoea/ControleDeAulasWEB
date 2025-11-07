import dayjs from 'dayjs';

export function containsWeekend(diasISO: string[]): boolean {
  return diasISO.some(iso => {
    const d = dayjs(iso).day();
    return d === 0 || d === 6;
  });
}