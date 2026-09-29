import { Tabs } from 'expo-router';
import { Feather, BookOpen } from 'lucide-react-native';
import React from 'react';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500' as const,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="(write)"
        options={{
          title: t.tabs.write,
          tabBarIcon: ({ color, size }) => <Feather size={size} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: t.tabs.journal,
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}
