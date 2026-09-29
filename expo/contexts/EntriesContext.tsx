import { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Entry, MoodType } from '@/types/entry';

const STORAGE_KEY = 'emotional_entries';

export const [EntriesProvider, useEntries] = createContextHook(() => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ['entries'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Entry[]) : [];
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (updated: Entry[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });

  useEffect(() => {
    if (entriesQuery.data) {
      setEntries(entriesQuery.data);
    }
  }, [entriesQuery.data]);

  const addEntry = useCallback((mood: MoodType, text: string) => {
    const newEntry: Entry = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      mood,
      text,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    syncMutation.mutate(updated);
    return newEntry;
  }, [entries, syncMutation]);

  const deleteEntry = useCallback((id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    syncMutation.mutate(updated);
  }, [entries, syncMutation]);

  return {
    entries,
    addEntry,
    deleteEntry,
    isLoading: entriesQuery.isLoading,
  };
});
