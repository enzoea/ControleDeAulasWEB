import { redirect } from 'next/navigation';

export default function PreenchimentoMensal() {
  redirect('/preenchimento-mensal/selecionar-dias');
  return null;
}