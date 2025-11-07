'use client';
import React from 'react';
import { Props } from './interface';
import { classes } from './styles';

export default function AppButton({ label, onClick, variant = 'primary', disabled, style }: Props) {
  const cls = [classes.base];
  if (variant === 'primary') cls.push(classes.primary);
  else if (variant === 'outline') cls.push(classes.outline);
  else if (variant === 'danger') cls.push(classes.danger);
  return (
    <button className={cls.join(' ')} onClick={onClick} disabled={disabled} style={style}>{label}</button>
  );
}