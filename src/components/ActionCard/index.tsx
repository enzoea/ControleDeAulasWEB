'use client';
import React from 'react';
import Link from 'next/link';
import { styles } from './styles';

type Props = { href: string; label: string; icon?: string; fullWidth?: boolean };

export default function ActionCard({ href, label, icon, fullWidth }: Props) {
  return (
    <Link href={href} style={{ textDecoration: 'none', flexBasis: fullWidth ? '100%' : '48%' }}>
      <div className="card" style={styles.card}>
        {icon ? <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div> : null}
        <div style={{ color: '#000', fontWeight: 600 }}>{label}</div>
      </div>
    </Link>
  );
}