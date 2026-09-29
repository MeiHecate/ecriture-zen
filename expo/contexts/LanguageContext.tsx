import { useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { Language, Translations, translations } from '@/constants/i18n';

const STORAGE_KEY = 'app_language';

function getDeviceLanguage(): Language {
  const deviceLocale = Localization.getLocales()[0]?.languageCode;
  return deviceLocale === 'fr' ? 'fr' : 'en';
}

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const queryClient = useQueryClient();

  const languageQuery = useQuery({
    queryKey: ['appLanguage'],
    queryFn: async (): Promise<Language> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'fr' || stored === 'en') return stored;
      return getDeviceLanguage();
    },
  });

  const setLanguageMutation = useMutation({
    mutationFn: async (lang: Language) => {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      return lang;
    },
    onSuccess: (lang) => {
      queryClient.setQueryData(['appLanguage'], lang);
    },
  });

  const language: Language = languageQuery.data ?? 'fr';
  const t: Translations = useMemo(() => translations[language], [language]);

  const setLanguage = useCallback(
    (lang: Language) => setLanguageMutation.mutate(lang),
    [setLanguageMutation]
  );

  return { language, t, setLanguage, isLoading: languageQuery.isLoading };
});
