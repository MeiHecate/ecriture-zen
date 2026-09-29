export type Language = 'en' | 'fr';

export interface Translations {
  tabs: {
    write: string;
    journal: string;
  };
  write: {
    greeting: string;
    subtitle: string;
    gratitude: string;
    gratitudeHint: string;
    frustration: string;
    frustrationHint: string;
    back: string;
    placeholderGratitude: string;
    placeholderFrustration: string;
    keep: string;
    letGo: string;
    doneKeep: string;
    doneLetGo: string;
  };
  journal: {
    title: string;
    entry: string;
    entries: string;
    emptyTitle: string;
    emptySubtitle: string;
    deleteTitle: string;
    deleteMessage: string;
    cancel: string;
    delete: string;
    today: string;
    yesterday: string;
    daysAgo: (days: number) => string;
    privacyPolicy: string;
  };
  notFound: {
    title: string;
    message: string;
    back: string;
  };
}

const en: Translations = {
  tabs: {
    write: 'Write',
    journal: 'Journal',
  },
  write: {
    greeting: "What's on your mind?",
    subtitle: 'Choose what you feel right now',
    gratitude: 'Gratitude',
    gratitudeHint: "What you're grateful for",
    frustration: 'Frustration',
    frustrationHint: "What's weighing on you",
    back: '← Back',
    placeholderGratitude: "Today, I'm grateful for...",
    placeholderFrustration: "What's frustrating me right now...",
    keep: 'Keep it',
    letGo: 'Let it go',
    doneKeep: 'Kept safe ✦',
    doneLetGo: 'Gone with the wind ༄',
  },
  journal: {
    title: 'Journal',
    entry: 'entry',
    entries: 'entries',
    emptyTitle: 'Nothing yet',
    emptySubtitle: 'The thoughts you choose to keep\nwill appear here',
    deleteTitle: 'Delete',
    deleteMessage: 'Do you really want to delete this entry?',
    cancel: 'Cancel',
    delete: 'Delete',
    today: 'Today,',
    yesterday: 'Yesterday,',
    daysAgo: (days: number) => `${days} days ago`,
    privacyPolicy: 'Privacy policy',
  },
  notFound: {
    title: 'Page not found',
    message: "This page doesn't exist.",
    back: 'Back',
  },
};

const fr: Translations = {
  tabs: {
    write: 'Écrire',
    journal: 'Journal',
  },
  write: {
    greeting: "Qu'est-ce qui t'habite ?",
    subtitle: 'Choisis ce que tu ressens en ce moment',
    gratitude: 'Gratitude',
    gratitudeHint: 'Ce qui te rend reconnaissant',
    frustration: 'Frustration',
    frustrationHint: 'Ce qui pèse sur toi',
    back: '← Retour',
    placeholderGratitude: "Aujourd'hui, je suis reconnaissant pour...",
    placeholderFrustration: 'Ce qui me frustre en ce moment...',
    keep: 'Le garder',
    letGo: 'Laisser partir',
    doneKeep: 'Gardé en sécurité ✦',
    doneLetGo: 'Parti avec le vent ༄',
  },
  journal: {
    title: 'Journal',
    entry: 'entrée',
    entries: 'entrées',
    emptyTitle: "Rien pour l'instant",
    emptySubtitle: 'Les pensées que tu choisis de garder\napparaîtront ici',
    deleteTitle: 'Supprimer',
    deleteMessage: 'Veux-tu vraiment supprimer cette entrée ?',
    cancel: 'Annuler',
    delete: 'Supprimer',
    today: "Aujourd'hui,",
    yesterday: 'Hier,',
    daysAgo: (days: number) => `Il y a ${days} jours`,
    privacyPolicy: 'Politique de confidentialité',
  },
  notFound: {
    title: 'Page introuvable',
    message: "Cette page n'existe pas.",
    back: 'Retour',
  },
};

export const translations: Record<Language, Translations> = { en, fr };
