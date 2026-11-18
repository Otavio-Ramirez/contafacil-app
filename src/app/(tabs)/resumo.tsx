import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AreaSegura } from '@/components/ui';
import { useContas } from '@/hooks/useContas';
import { brl, hojeISO, MESES } from '@/lib/utils';
import { cores } from '@/theme';

const LETRAS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const ALTURA = 200;

export default function Resumo() {
  const { contas } = useContas();
  const [modo, setModo] = useState<'mes' | 'ano'>('mes');

  const hoje = hojeISO();
  const ano = hoje.slice(0, 4);
  const mesAtual = Number(hoje.slice(5, 7)) - 1; // 0 a 11

  // total de cada mês do ano
  const porMes = Array.from({ length: 12 }, (_, i) => {
    const prefixo = `${ano}-${String(i + 1).padStart(2, '0')}`;
    return contas
      .filter((c) => c.paga && c.dataPagamento?.startsWith(prefixo))
      .reduce((s, c) => s + (c.valorPago ?? c.valor), 0);
  });
  const totalAno = porMes.reduce((a, b) => a + b, 0);
  const mesesComGasto = porMes.filter((v) => v > 0).length || 1;
  const media = totalAno / mesesComGasto;
  const maximo = Math.max(...porMes, 1);

  const tituloGrande = modo === 'mes' ? `Total em ${MESES[mesAtual]}` : `Total em ${ano}`;
  const valorGrande = modo === 'mes' ? porMes[mesAtual] : totalAno;

  return (
    <AreaSegura>
      <ScrollView contentContainerStyle={{ padding: 18, gap: 18 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: cores.texto }}>Resumo</Text>

        <View style={{ flexDirection: 'row', backgroundColor: '#E2E5EA', borderRadius: 16, padding: 6 }}>
          {(['mes', 'ano'] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => setModo(m)}
              style={{ flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: modo === m ? cores.primaria : 'transparent' }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: modo === m ? '#fff' : '#334155' }}>{m === 'mes' ? 'Mês' : 'Ano'}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ backgroundColor: cores.primaria, borderRadius: 24, padding: 22, gap: 14 }}>
          <View>
            <Text style={{ color: '#DBE6FF', fontSize: 16, textTransform: 'capitalize' }}>{tituloGrande}</Text>
            <Text style={{ color: '#fff', fontSize: 44, fontWeight: '800' }}>{brl(valorGrande)}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#DBE6FF', fontSize: 14 }}>Total em {ano}</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{brl(totalAno)}</Text>
            </View>
            <View>
              <Text style={{ color: '#DBE6FF', fontSize: 14 }}>Média mensal</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{brl(media)}</Text>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: cores.borda, padding: 20, gap: 6 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: cores.texto }}>Gastos por mês em {ano}</Text>
          <Text style={{ fontSize: 15, color: cores.texto2 }}>Somando as contas pagas</Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: ALTURA + 10, marginTop: 14 }}>
            {porMes.map((v, i) => {
              const futuro = i > mesAtual;
              const altura = futuro || v === 0 ? 4 : Math.max(10, (v / maximo) * ALTURA);
              const cor = futuro || v === 0 ? '#D0D5DD' : i === mesAtual ? cores.primaria : '#5B83F2';
              return <View key={i} style={{ width: 17, height: altura, borderRadius: 4, backgroundColor: cor }} />;
            })}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            {LETRAS.map((l, i) => (
              <Text key={i} style={{ width: 17, textAlign: 'center', fontSize: 14, fontWeight: i === mesAtual ? '800' : '500', color: i === mesAtual ? cores.texto : cores.texto2 }}>
                {l}
              </Text>
            ))}
          </View>

          <Text style={{ fontSize: 15, color: cores.texto2, marginTop: 10, lineHeight: 22 }}>
            {mesAtual > 0 ? `${MESES[mesAtual - 1][0].toUpperCase()}${MESES[mesAtual - 1].slice(1)}: ${brl(porMes[mesAtual - 1])}. ` : ''}
            {`${MESES[mesAtual][0].toUpperCase()}${MESES[mesAtual].slice(1)}: ${brl(porMes[mesAtual])}, ainda em andamento.`}
          </Text>
        </View>
      </ScrollView>
    </AreaSegura>
  );
}