'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { styles } from './styles';

type Props = { title: string; showBack?: boolean; backColor?: string; backSize?: number };

export default function InlineHeader({ title, showBack = true, backColor = '#000', backSize = 24 }: Props) {
  const router = useRouter();
  return (
    <div style={styles.container}>
      {showBack && (
        <button aria-label="Voltar" onClick={() => router.back()} style={styles.backBtn}>
          <span style={{ color: backColor, fontSize: backSize }}>←</span>
        </button>
      )}
      <span style={styles.title}>{title}</span>
    </div>
  );
}