export const metadata = {
  title: 'Controle de Aulas (Web)',
  description: 'Port do PontoProz para web com Next.js',
};

import './globals.css';
import 'react-day-picker/dist/style.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}