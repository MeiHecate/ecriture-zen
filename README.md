# Espace d'Écriture Zen

Application iOS d'écriture sans distraction : on choisit ce qu'on ressent, on l'écrit, puis on décide de garder le texte ou de le laisser partir. En français ou en anglais selon la langue du téléphone.

Disponible sur l'[App Store](https://apps.apple.com/app/id6761679327).

## Ce que fait l'app

- Deux points de départ : la gratitude (ce qui fait du bien) ou la frustration (ce qui pèse).
- Une page d'écriture épurée, sans autre élément à l'écran.
- À la fin, « Le garder » range le texte dans le journal, « Laisser partir » l'efface avec une animation.
- Le journal liste les textes gardés et permet de les supprimer.
- Tout reste sur le téléphone (AsyncStorage), sans compte.

## Stack

- React Native, Expo SDK 54, expo-router
- TypeScript
- TanStack Query et AsyncStorage pour les entrées du journal
- expo-haptics, expo-localization
- Bun, EAS Build et EAS Submit

## Organisation du code

Le projet est dans `expo/` :

- `app/` : deux onglets avec expo-router, l'écriture (`(write)`) et le journal (`journal`).
- `contexts/` : les entrées du journal et la langue.
- `constants/` : couleurs et traductions.
- `types/` : les types partagés.

## Lancer le projet

```bash
cd expo
bun install
bunx expo start
```

Vérifications :

```bash
bunx tsc --noEmit
bunx expo lint
```

## Build et publication

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

La clé App Store Connect n'est pas dans le dépôt : `eas submit` la lit dans les variables `EXPO_ASC_API_KEY_PATH`, `EXPO_ASC_KEY_ID` et `EXPO_ASC_ISSUER_ID`.

## Licence

Code source consultable, tous droits réservés. Voir [LICENSE](LICENSE).
