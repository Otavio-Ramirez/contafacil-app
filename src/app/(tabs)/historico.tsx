import { Fragment } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AreaSegura, IconeConta, Selo } from '@/components/ui';
import { useContas } from '@/hooks/useContas';
import { brl, diasEntre, isoCurto, MESES } from '@/lib/utils';
import { Conta } from '@/services/contas';
import { cores } from '@/theme';

function seloPagamento(c: Conta) {
  const d = diasEntre(c.dataPagamento!, c.vencimento); // positivo = pagou antes
  if (d > 0) return <Selo texto={`${d} dia${d === 1 ? '' : 's'} antes`} tom="sucesso" icone="checkmark" />;
  if (d === 0) return <Selo texto="No dia" tom="sucesso" icone="checkmark" />;
  return <Selo texto={`${-d} dia${d === -1 ? '' : 's'} de atraso`} tom="perigo" icone="alert-circle-outline" />;
}

export default function Historico() {
  const { contas } = useContas();
  const pagas = contas.filter((c) => c.paga && c.dataPagamento);

  // agrupa por mês: { "2026-11": [contas...] }
  const grupos: Record<string, Conta[]> = {};
  pagas.forEach((c) => {
    const chave = c.dataPagamento!.slice(0, 7);
    (grupos[chave] ??= []).push(c);
  });
  const chaves = Object.keys(grupos).sort().reverse();

  return (
    <AreaSegura>
      <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
        <View>
          <Text style={{ fontSize: 32, fontWeight: '800', color: cores.texto }}>Histórico</Text>
          <Text style={{ fontSize: 16, color: cores.texto2 }}>Veja quando cada conta foi paga.</Text>
        </View>

        {chaves.length === 0 && (
          <Text style={{ fontSize: 16, color: cores.texto2, marginTop: 20 }}>Nenhum pagamento registrado ainda.</Text>
        )}

        {chaves.map((chave) => {
          const lista = grupos[chave].sort((a, b) => b.dataPagamento!.localeCompare(a.dataPagamento!));
          const total = lista.reduce((s, c) => s + (c.valorPago ?? c.valor), 0);
          const nomeMes = MESES[Number(chave.slice(5)) - 1];
          return (
            <View key={chave} style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 4 }}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: cores.texto, textTransform: 'capitalize' }}>{nomeMes}</Text>
                <Text style={{ fontSize: 14, color: cores.texto2 }}>
                  {lista.length} pagamento{lista.length === 1 ? '' : 's'} · {brl(total)}
                </Text>
              </View>
              <View style={{ backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: cores.borda, overflow: 'hidden' }}>
                {lista.map((c, i) => (
                  <Fragment key={c.id}>
                    {i > 0 && <View style={{ height: 1, backgroundColor: cores.borda }} />}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
                      <IconeConta nome={c.nome} tamanho={48} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: cores.texto }}>{c.nome}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#334155' }}>Paga em {isoCurto(c.dataPagamento!)}</Text>
                        <Text style={{ fontSize: 14, color: cores.texto2 }}>Vencia em {isoCurto(c.vencimento)}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', gap: 6 }}>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: cores.texto }}>{brl(c.valorPago ?? c.valor)}</Text>
                        {seloPagamento(c)}
                      </View>
                    </View>
                  </Fragment>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </AreaSegura>
  );
}