import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { AreaSegura, Botao, Caixa, Campo, Icone, IconeConta } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useContas } from '@/hooks/useContas';
import { brl, brParaISO, hojeISO, isoCurto, isoParaBR, mascaraData, MESES, paraNumero } from '@/lib/utils';
import { pagarConta, totalPago } from '@/services/contas';
import { cores } from '@/theme';

export default function ConfirmarPagamento() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { contas } = useContas();
  const conta = contas.find((c) => c.id === id);

  const [data, setData] = useState(isoParaBR(hojeISO()));
  const [valor, setValor] = useState('');
  const [anexar, setAnexar] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (conta && valor === '') setValor(conta.valor.toFixed(2).replace('.', ','));
  }, [conta]);

  if (!conta) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={cores.primaria} />
      </View>
    );
  }

  const iso = brParaISO(data);
  const mesAtual = hojeISO().slice(0, 7);
  const atual = totalPago(contas, mesAtual);
  const novo = atual + paraNumero(valor);
  const nomeMes = MESES[Number(mesAtual.slice(5)) - 1];

  const confirmar = async () => {
    if (!iso) return Alert.alert('Atenção', 'Data inválida. Use dd/mm/aaaa.');
    if (paraNumero(valor) <= 0) return Alert.alert('Atenção', 'Informe o valor pago.');
    try {
      setSalvando(true);
      await pagarConta(user!.uid, conta, iso, paraNumero(valor));
      router.replace('/');
    } catch (e) {
      console.log(e);
      Alert.alert('Erro', 'Não foi possível confirmar o pagamento.');
      setSalvando(false);
    }
  };

  return (
    <AreaSegura>
      <ScrollView contentContainerStyle={{ padding: 18, gap: 18 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icone nome="arrow-back" size={28} color={cores.texto} />
          </Pressable>
          <Text style={{ fontSize: 28, fontWeight: '800', color: cores.texto }}>Confirmar pagamento</Text>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: cores.borda, padding: 24, alignItems: 'center', gap: 6 }}>
          <IconeConta nome={conta.nome} tamanho={64} destaque />
          <Text style={{ fontSize: 22, fontWeight: '800', color: cores.texto, marginTop: 8 }}>{conta.nome}</Text>
          <Text style={{ fontSize: 16, color: cores.texto2 }}>Vence em {isoCurto(conta.vencimento)}</Text>
          <Text style={{ fontSize: 40, fontWeight: '800', color: cores.texto }}>{brl(conta.valor)}</Text>
        </View>

        <Campo rotulo="Data do pagamento" value={data} onChangeText={(t) => setData(mascaraData(t))} keyboardType="number-pad" />
        <Campo rotulo="Valor pago" value={valor} onChangeText={setValor} keyboardType="decimal-pad" />
        <Caixa marcado={anexar} aoMudar={setAnexar} texto="Anexar comprovante (opcional)" />

        <View style={{ backgroundColor: cores.primariaClara, borderRadius: 16, padding: 16, flexDirection: 'row', gap: 12 }}>
          <Icone nome="information-circle-outline" size={22} />
          <Text style={{ flex: 1, fontSize: 16, color: cores.primaria, lineHeight: 23 }}>
            Seu gasto de {nomeMes} passa de {brl(atual)} para {brl(novo)}.
          </Text>
        </View>

        <Botao titulo="Confirmar pagamento" tipo="sucesso" icone="checkmark" onPress={confirmar} carregando={salvando} />
        <Pressable onPress={() => router.back()} style={{ alignItems: 'center', padding: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#334155' }}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </AreaSegura>
  );
}