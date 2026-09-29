import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFoundScreen() {
  const { t } = useLanguage();
  return (
    <>
      <Stack.Screen options={{ title: t.notFound.title }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t.notFound.message}</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>{t.notFound.back}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: Colors.text,
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    color: Colors.accent,
  },
});
