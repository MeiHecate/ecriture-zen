export type MoodType = 'gratitude' | 'frustration';

export interface Entry {
  id: string;
  mood: MoodType;
  text: string;
  createdAt: string;
}
