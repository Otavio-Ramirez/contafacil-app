import { Tabs } from 'expo-router';

import { Icone, NomeIcone } from '@/components/ui';
import { cores } from '@/theme';

const icone = (nome: NomeIcone) =>
  function TabIcon(props: { color: any; size: number }) {
    return <Icone nome={nome} size={props.size} color={props.color} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.texto2,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: { height: 66, paddingTop: 6, paddingBottom: 8 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icone('home-outline') }} />
      <Tabs.Screen name="adicionar" options={{ title: 'Adicionar', tabBarIcon: icone('add-circle-outline') }} />
      <Tabs.Screen name="historico" options={{ title: 'Histórico', tabBarIcon: icone('time-outline') }} />
      <Tabs.Screen name="resumo" options={{ title: 'Resumo', tabBarIcon: icone('stats-chart-outline') }} />
    </Tabs>
  );
}