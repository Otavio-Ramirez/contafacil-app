import { addMeses } from '@/lib/utils';

export type Conta = {
  id: string;
  nome: string;
  valor: number;
  vencimento: string; // "2026-11-03"
  categoria: string;
  repetir: string;
  lembrete: string;
  paga: boolean;
  dataPagamento?: string;
  valorPago?: number;
};

export type NovaConta = Omit<Conta, 'id' | 'paga' | 'dataPagamento' | 'valorPago'>;

// "Banco" na memória: { uid do usuário: [contas] }
const banco: Record<string, Conta[]> = {};
const ouvintes: Record<string, Set<(c: Conta[]) => void>> = {};

const lista = (uid: string) => (banco[uid] ??= []);
const novoId = () => `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

// avisa as telas que algo mudou
const avisar = (uid: string) => {
  const copia = [...lista(uid)];
  ouvintes[uid]?.forEach((fn) => fn(copia));
};

// LER (em tempo real): chama "aoMudar" agora e a cada mudança
export function ouvirContas(uid: string, aoMudar: (c: Conta[]) => void, aoErrar: (e: Error) => void) {
  try {
    (ouvintes[uid] ??= new Set()).add(aoMudar);
    aoMudar([...lista(uid)]);
  } catch (e) {
    aoErrar(e as Error);
  }
  return () => {
    ouvintes[uid]?.delete(aoMudar);
  };
}

// CRIAR
export async function criarConta(uid: string, dados: NovaConta) {
  lista(uid).push({ ...dados, id: novoId(), paga: false });
  avisar(uid);
}

// ATUALIZAR (marcar como paga) e, se repete, já cria a próxima conta
export async function pagarConta(uid: string, conta: Conta, dataPagamento: string, valorPago: number) {
  const itens = lista(uid);
  const i = itens.findIndex((c) => c.id === conta.id);
  if (i >= 0) itens[i] = { ...itens[i], paga: true, dataPagamento, valorPago };

  const meses = conta.repetir === 'Todo mês' ? 1 : conta.repetir === 'Todo ano' ? 12 : 0;
  if (meses > 0) {
    itens.push({
      id: novoId(),
      nome: conta.nome,
      valor: conta.valor,
      vencimento: addMeses(conta.vencimento, meses),
      categoria: conta.categoria,
      repetir: conta.repetir,
      lembrete: conta.lembrete,
      paga: false,
    });
  }
  avisar(uid);
}

// prefixo: "2026-11" (mês) ou "2026" (ano)
export function totalPago(contas: Conta[], prefixo: string) {
  return contas
    .filter((c) => c.paga && c.dataPagamento?.startsWith(prefixo))
    .reduce((soma, c) => soma + (c.valorPago ?? c.valor), 0);
}