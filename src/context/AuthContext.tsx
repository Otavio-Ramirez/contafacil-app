import { createContext, ReactNode, useContext, useState } from 'react';

export type Usuario = {
  uid: string;
  displayName: string;
  email: string;
};

type AuthCtx = {
  user: Usuario | null;
  carregando: boolean;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function traduzErro(e: any): string {
  switch (e?.code) {
    case 'auth/email-already-in-use': return 'Este e-mail já está cadastrado.';
    case 'auth/invalid-email': return 'E-mail inválido.';
    case 'auth/weak-password': return 'A senha precisa ter pelo menos 8 caracteres.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return 'E-mail ou senha incorretos.';
    case 'auth/network-request-failed': return 'Sem conexão com a internet.';
    default: return 'Algo deu errado. Tente novamente.';
  }
}

// "Banco" de usuários na memória (some ao fechar o app)
type Cadastro = Usuario & { senha: string };
const usuarios: Cadastro[] = [];

const erro = (code: string) => Object.assign(new Error(code), { code });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const carregando = false;

  const cadastrar = async (nome: string, email: string, senha: string) => {
    const e = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(e)) throw erro('auth/invalid-email');
    if (senha.length < 8) throw erro('auth/weak-password');
    if (usuarios.some((u) => u.email === e)) throw erro('auth/email-already-in-use');

    const novo: Cadastro = {
      uid: `u${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
      displayName: nome.trim(),
      email: e,
      senha,
    };
    usuarios.push(novo);
    setUser({ uid: novo.uid, displayName: novo.displayName, email: novo.email });
  };

  const entrar = async (email: string, senha: string) => {
    const e = email.trim().toLowerCase();
    const u = usuarios.find((x) => x.email === e && x.senha === senha);
    if (!u) throw erro('auth/invalid-credential');
    setUser({ uid: u.uid, displayName: u.displayName, email: u.email });
  };

  const sair = async () => {
    setUser(null);
  };

  return <Ctx.Provider value={{ user, carregando, cadastrar, entrar, sair }}>{children}</Ctx.Provider>;
}