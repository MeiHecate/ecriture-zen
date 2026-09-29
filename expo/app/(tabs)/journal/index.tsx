import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Flame, Trash2, BookOpen } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useEntries } from '@/contexts/EntriesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Translations, Language } from '@/constants/i18n';
import { Entry } from '@/types/entry';

function formatDate(dateStr: string, t: Translations, language: Language): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  if (diffDays === 0) {
    return t.journal.today + ' ' + date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) {
    return t.journal.yesterday + ' ' + date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays < 7) {
    return t.journal.daysAgo(diffDays);
  }
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

const EntryCard = React.memo(({ item, onDelete, t, language }: { item: Entry; onDelete: (id: string) => void; t: Translations; language: Language }) => {
  const isGratitude = item.mood === 'gratitude';
  const moodColor = isGratitude ? Colors.gratitude : Colors.frustration;
  const moodBg = isGratitude ? Colors.gratitudeLight : Colors.frustrationLight;

  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t.journal.deleteTitle,
      t.journal.deleteMessage,
      [
        { text: t.journal.cancel, style: 'cancel' },
        {
          text: t.journal.delete,
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ],
    );
  }, [item.id, onDelete, t]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.moodTag, { backgroundColor: moodBg }]}>
          {isGratitude ? (
            <Heart size={12} color={moodColor} strokeWidth={2} />
          ) : (
            <Flame size={12} color={moodColor} strokeWidth={2} />
          )}
          <Text style={[styles.moodTagText, { color: moodColor }]}>
            {isGratitude ? t.write.gratitude : t.write.frustration}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDelete} hitSlop={12} testID={`delete-${item.id}`}>
          <Trash2 size={16} color={Colors.textMuted} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText} numberOfLines={6}>
        {item.text}
      </Text>
      <Text style={styles.cardDate}>{formatDate(item.createdAt, t, language)}</Text>
    </View>
  );
});
EntryCard.displayName = 'EntryCard';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { entries, deleteEntry, isLoading } = useEntries();
  const { t, language } = useLanguage();

  const renderItem = useCallback(
    ({ item }: { item: Entry }) => <EntryCard item={item} onDelete={deleteEntry} t={t} language={language} />,
    [deleteEntry, t, language],
  );

  const keyExtractor = useCallback((item: Entry) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.journal.title}</Text>
        <Text style={styles.count}>
          {entries.length} {entries.length === 1 ? t.journal.entry : t.journal.entries}
        </Text>
      </View>

      {entries.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <BookOpen size={48} color={Colors.textMuted} strokeWidth={1} />
          <Text style={styles.emptyTitle}>{t.journal.emptyTitle}</Text>
          <Text style={styles.emptySubtitle}>
            {t.journal.emptySubtitle}
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  count: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodTagText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
    fontWeight: '300' as const,
    letterSpacing: 0.1,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '400' as const,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
