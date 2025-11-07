'use client';
import React from 'react';
import { classes } from './styles';

export default function AppFooter() {
  return (
    <div className={classes.footer}>
      Desenvolvido por <a href="https://www.linkedin.com/in/enzomartinsdev/" target="_blank" rel="noreferrer">Enzo Martins</a>
    </div>
  );
}