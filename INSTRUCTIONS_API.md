# 🔑 Configuration de l'API

## ⚙️ API Personnalisée

L'application utilise une API personnalisée hébergée sur **tomgaillard.fr**.

## 📝 Configuration actuelle

### URL de l'API
```
https://tomgaillard.fr/api/nba-data/content.json
```

### Fichier de configuration
`src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://tomgaillard.fr/api/nba-data/content.json',
  sport: 'Basketball',
  league: 'NBA'
};
```

## 📤 Upload du fichier JSON

1. Uploadez le fichier `content.json` (à la racine du projet) sur votre serveur
2. Placez-le à : `https://tomgaillard.fr/api/nba-data/content.json`
3. Assurez-vous que les headers CORS sont configurés :
   ```
   Access-Control-Allow-Origin: *
   Content-Type: application/json
   ```

## 🔄 Fallback local

Si l'API distante est indisponible, l'application charge automatiquement les données depuis :
```
/assets/data/nba-players.json
```

## ✅ Vérification

Une fois le serveur configuré, rechargez : http://localhost:4200/players

## 📊 Format des données

Le fichier JSON doit contenir un tableau de joueurs :
```json
[
  {
    "idPlayer": "1",
    "strPlayer": "LeBron James",
    "strTeam": "Los Angeles Lakers",
    "strSport": "Basketball",
    "strPosition": "SF",
    "strHeight": "6'9\"",
    "strWeight": "250 lbs",
    "strNationality": "USA",
    "dateBorn": "1984-12-30",
    "strThumb": "https://..."
  }
]
```

## 🛠️ Fichiers générés

- `content.json` : 100 joueurs NBA à uploader sur le serveur
- `src/assets/data/nba-players.json` : Fichier de fallback local
