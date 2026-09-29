import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EntriesProvider } from '@/contexts/EntriesContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Colors from '@/constants/colors';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true, duration: 200 });

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { t } = useLanguage();
  return (
    <Stack
      screenOptions={{
        headerBackTitle: t.notFound.back,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
        <LanguageProvider>
          <EntriesProvider>
            <StatusBar style="light" />
            <RootLayoutNav />
          </EntriesProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
