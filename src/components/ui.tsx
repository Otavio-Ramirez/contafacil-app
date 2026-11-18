import { ReactNode } from 'react';
import {
    ActivityIndicator, ColorValue, Platform, Pressable, SafeAreaView, StatusBar, Text,
    TextInput, TextInputProps, View, ViewStyle,
} from 'react-native';

import { cores } from '@/theme';

// ---------- Ícones (emojis, não precisa instalar nada) ----------
const GLIFOS = {
  checkmark: '✓',
  add: '+',
  'add-circle-outline': '➕',
  'alert-circle-outline': '⚠️',
  'time-outline': '🕒',
  'flash-outline': '⚡',
  'wifi-outline': '📶',
  'water-outline': '💧',
  'flame-outline': '🔥',
  'home-outline': '🏠',
  'phone-portrait-outline': '📱',
  'card-outline': '💳',
  'receipt-outline': '🧾',
  'person-outline': '👤',
  'arrow-back': '←',
  'information-circle-outline': 'ℹ️',
  'stats-chart-outline': '📊',
} as const;

export type NomeIcone = keyof typeof GLIFOS;

export function Icone({ nome, size = 20, color }: { nome: NomeIcone; size?: number; color?: ColorValue }) {
  return <Text style={{ fontSize: size, color: color ?? undefined, fontWeight: '700' }}>{GLIFOS[nome]}</Text>;
}

// ---------- Área segura (evita ficar embaixo da barra de status) ----------
export function AreaSegura({ style, children }: { style?: ViewStyle; children: ReactNode }) {
  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: cores.fundo, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0 },
        style,
      ]}>
      {children}
    </SafeAreaView>
  );
}

export function Logo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' }}>
        <Icone nome="checkmark" size={30} color="#fff" />
      </View>
      <Text style={{ fontSize: 26, fontWeight: '800', color: cores.texto }}>Conta Fácil</Text>
    </View>
  );
}

export function Botao({
  titulo, onPress, tipo = 'primario', carregando, icone, pequeno,
}: {
  titulo: string; onPress: () => void; tipo?: 'primario' | 'contorno' | 'sucesso';
  carregando?: boolean; icone?: NomeIcone; pequeno?: boolean;
}) {
  const fundo = tipo === 'primario' ? cores.primaria : tipo === 'sucesso' ? cores.sucesso : 'transparent';
  const texto = tipo === 'contorno' ? cores.primaria : '#fff';
  return (
    <Pressable
      onPress={onPress}
      disabled={carregando}
      style={({ pressed }) => [
        {
          backgroundColor: fundo, borderRadius: pequeno ? 12 : 16, height: pequeno ? 46 : 56,
          alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
          opacity: pressed ? 0.85 : 1, paddingHorizontal: 12,
        },
        tipo === 'contorno' && { borderWidth: 1.5, borderColor: cores.primaria },
      ]}>
      {carregando ? (
        <ActivityIndicator color={texto} />
      ) : (
        <>
          {icone && <Icone nome={icone} size={20} color={texto} />}
          <Text style={{ color: texto, fontSize: pequeno ? 14 : 17, fontWeight: '700' }}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Campo({ rotulo, ...props }: { rotulo: string } & TextInputProps) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#334155' }}>{rotulo}</Text>
      <TextInput
        placeholderTextColor="#8A93A3"
        {...props}
        style={{
          height: 54, borderRadius: 14, borderWidth: 1.5, borderColor: cores.bordaInput,
          backgroundColor: '#fff', paddingHorizontal: 16, fontSize: 17, color: cores.texto,
        }}
      />
    </View>
  );
}

export function Opcoes({
  rotulo, opcoes, valor, aoMudar,
}: { rotulo: string; opcoes: string[]; valor: string; aoMudar: (v: string) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#334155' }}>{rotulo}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {opcoes.map((o) => {
          const ativo = o === valor;
          return (
            <Pressable
              key={o}
              onPress={() => aoMudar(o)}
              style={{
                paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5,
                borderColor: ativo ? cores.primaria : cores.bordaInput,
                backgroundColor: ativo ? cores.primariaClara : '#fff',
              }}>
              <Text style={{ color: ativo ? cores.primaria : cores.texto, fontWeight: ativo ? '700' : '500', fontSize: 15 }}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Caixa({ marcado, aoMudar, texto }: { marcado: boolean; aoMudar: (v: boolean) => void; texto: string }) {
  return (
    <Pressable onPress={() => aoMudar(!marcado)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 26, height: 26, borderRadius: 6, borderWidth: 1.5, borderColor: marcado ? cores.primaria : cores.bordaInput,
          backgroundColor: marcado ? cores.primaria : '#fff', alignItems: 'center', justifyContent: 'center',
        }}>
        {marcado && <Icone nome="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={{ flex: 1, fontSize: 15, color: '#334155' }}>{texto}</Text>
    </Pressable>
  );
}

export function Selo({ texto, tom, icone }: { texto: string; tom: 'perigo' | 'alerta' | 'sucesso'; icone: NomeIcone }) {
  const bg = tom === 'perigo' ? cores.perigoBg : tom === 'alerta' ? cores.alertaBg : cores.sucessoBg;
  const fg = tom === 'perigo' ? cores.perigo : tom === 'alerta' ? cores.alerta : cores.sucesso;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, alignSelf: 'flex-start' }}>
      <Icone nome={icone} size={13} color={fg} />
      <Text style={{ color: fg, fontWeight: '700', fontSize: 13 }}>{texto}</Text>
    </View>
  );
}

export function iconeDaConta(nome: string): NomeIcone {
  const n = nome.toLowerCase();
  if (n.includes('energia') || n.includes('luz')) return 'flash-outline';
  if (n.includes('internet') || n.includes('wifi')) return 'wifi-outline';
  if (n.includes('água') || n.includes('agua')) return 'water-outline';
  if (n.includes('gás') || n.includes('gas')) return 'flame-outline';
  if (n.includes('condom') || n.includes('alug')) return 'home-outline';
  if (n.includes('celular') || n.includes('telefone')) return 'phone-portrait-outline';
  if (n.includes('cartão') || n.includes('cartao')) return 'card-outline';
  return 'receipt-outline';
}

export function IconeConta({ nome, tamanho = 52, destaque }: { nome: string; tamanho?: number; destaque?: boolean }) {
  return (
    <View style={{ width: tamanho, height: tamanho, borderRadius: 14, backgroundColor: destaque ? cores.primariaClara : '#F1F3F7', alignItems: 'center', justifyContent: 'center' }}>
      <Icone nome={iconeDaConta(nome)} size={tamanho * 0.45} />
    </View>
  );
}