import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Flame, Archive, Wind } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useEntries } from '@/contexts/EntriesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MoodType } from '@/types/entry';

type Phase = 'mood' | 'writing' | 'done';

export default function WriteScreen() {
  const insets = useSafeAreaInsets();
  const { addEntry } = useEntries();
  const { t } = useLanguage();

  const [phase, setPhase] = useState<Phase>('mood');
  const [mood, setMood] = useState<MoodType | null>(null);
  const [text, setText] = useState<string>('');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const doneOpacity = useRef(new Animated.Value(0)).current;
  const doneMessage = useRef<string>('');

  const resetAll = useCallback(() => {
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
    floatAnim.setValue(0);
    doneOpacity.setValue(0);
    setPhase('mood');
    setMood(null);
    setText('');
  }, [fadeAnim, scaleAnim, floatAnim, doneOpacity]);

  const handleMoodSelect = useCallback((selected: MoodType) => {
    setMood(selected);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhase('writing');
  }, []);

  const handleKeep = useCallback(() => {
    if (!mood || !text.trim()) return;
    Keyboard.dismiss();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addEntry(mood, text.trim());
    doneMessage.current = t.write.doneKeep;
    setPhase('done');
    Animated.timing(doneOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setTimeout(resetAll, 2200);
  }, [mood, text, addEntry, doneOpacity, resetAll, t]);

  const handleLetGo = useCallback(() => {
    if (!text.trim()) return;
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 1800,
        useNativeDriver: true,
      }),
      Animated.timing(floatAnim, {
        toValue: -60,
        duration: 1800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      doneMessage.current = t.write.doneLetGo;
      setPhase('done');
      Animated.timing(doneOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
      setTimeout(resetAll, 2200);
    });
  }, [text, fadeAnim, scaleAnim, floatAnim, doneOpacity, resetAll, t]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhase('mood');
    setMood(null);
    setText('');
  }, []);

  if (phase === 'done') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View style={[styles.doneContainer, { opacity: doneOpacity }]}>
          <Text style={styles.doneText}>{doneMessage.current}</Text>
        </Animated.View>
      </View>
    );
  }

  if (phase === 'mood') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.moodContainer}>
          <Text style={styles.greeting}>{t.write.greeting}</Text>
          <Text style={styles.subtitle}>{t.write.subtitle}</Text>

          <View style={styles.moodCards}>
            <TouchableOpacity
              style={[styles.moodCard, styles.gratitudeCard]}
              onPress={() => handleMoodSelect('gratitude')}
              activeOpacity={0.7}
              testID="mood-gratitude"
            >
              <View style={styles.moodIconWrap}>
                <Heart size={32} color={Colors.gratitude} strokeWidth={1.5} />
              </View>
              <Text style={[styles.moodLabel, { color: Colors.gratitude }]}>{t.write.gratitude}</Text>
              <Text style={styles.moodHint}>{t.write.gratitudeHint}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.moodCard, styles.frustrationCard]}
              onPress={() => handleMoodSelect('frustration')}
              activeOpacity={0.7}
              testID="mood-frustration"
            >
              <View style={styles.moodIconWrap}>
                <Flame size={32} color={Colors.frustration} strokeWidth={1.5} />
              </View>
              <Text style={[styles.moodLabel, { color: Colors.frustration }]}>{t.write.frustration}</Text>
              <Text style={styles.moodHint}>{t.write.frustrationHint}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const moodColor = mood === 'gratitude' ? Colors.gratitude : Colors.frustration;
  const moodBg = mood === 'gratitude' ? Colors.gratitudeLight : Colors.frustrationLight;
  const placeholder =
    mood === 'gratitude'
      ? t.write.placeholderGratitude
      : t.write.placeholderFrustration;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.writingHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.6}>
          <Text style={styles.backText}>{t.write.back}</Text>
        </TouchableOpacity>
        <View style={[styles.moodBadge, { backgroundColor: moodBg }]}>
          {mood === 'gratitude' ? (
            <Heart size={14} color={moodColor} strokeWidth={2} />
          ) : (
            <Flame size={14} color={moodColor} strokeWidth={2} />
          )}
          <Text style={[styles.moodBadgeText, { color: moodColor }]}>
            {mood === 'gratitude' ? t.write.gratitude : t.write.frustration}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.writingBody}
        contentContainerStyle={styles.writingBodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
            flex: 1,
          }}
        >
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={Colors.textMuted}
            multiline
            autoFocus
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
            selectionColor={moodColor}
            testID="writing-input"
          />
        </Animated.View>
      </ScrollView>

      {text.trim().length > 0 && (
        <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.keepBtn]}
            onPress={handleKeep}
            activeOpacity={0.7}
            testID="btn-keep"
          >
            <Archive size={18} color={Colors.accent} strokeWidth={1.5} />
            <Text style={styles.keepBtnText}>{t.write.keep}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.letGoBtn]}
            onPress={handleLetGo}
            activeOpacity={0.7}
            testID="btn-letgo"
          >
            <Wind size={18} color={Colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.letGoBtnText}>{t.write.letGo}</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  moodContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 48,
    letterSpacing: 0.2,
  },
  moodCards: {
    gap: 16,
  },
  moodCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
  },
  gratitudeCard: {
    backgroundColor: Colors.gratitudeLight,
    borderColor: 'rgba(127, 176, 139, 0.2)',
  },
  frustrationCard: {
    backgroundColor: Colors.frustrationLight,
    borderColor: 'rgba(196, 122, 122, 0.2)',
  },
  moodIconWrap: {
    marginBottom: 16,
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  moodHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 0.1,
  },
  writingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  moodBadgeText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  writingBody: {
    flex: 1,
  },
  writingBodyContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    flexGrow: 1,
  },
  textInput: {
    fontSize: 18,
    lineHeight: 28,
    color: Colors.text,
    minHeight: 200,
    letterSpacing: 0.2,
    fontWeight: '300' as const,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  keepBtn: {
    backgroundColor: 'rgba(212, 169, 106, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 106, 0.25)',
  },
  keepBtnText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  letGoBtn: {
    backgroundColor: Colors.surface,
  },
  letGoBtnText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  doneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    fontSize: 22,
    color: Colors.textSecondary,
    fontWeight: '300' as const,
    letterSpacing: 1,
  },
});
