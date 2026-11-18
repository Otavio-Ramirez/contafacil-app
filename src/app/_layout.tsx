import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { cores } from '@/theme';

function Rotas() {
  const { user, carregando } = useAuth();
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    const naAuth = segmentos[0] === '(auth)';
    if (!user && !naAuth) router.replace('/login');
    if (user && naAuth) router.replace('/');
  }, [user, carregando, segmentos]);

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundo }}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Rotas />
    </AuthProvider>
  );
}