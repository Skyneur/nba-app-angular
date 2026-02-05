# 🔑 Configuration de l'API Key

## ⚠️ IMPORTANT : L'API nécessite une clé d'authentification

L'API **balldontlie.io** nécessite maintenant une clé API gratuite pour fonctionner.

## 📝 Étapes pour obtenir votre clé API

### 1. Créer un compte gratuit
Rendez-vous sur : **https://www.balldontlie.io/**

### 2. Récupérer votre clé API
- Connectez-vous à votre compte
- Allez dans la section "API Keys"
- Copiez votre clé API

### 3. Configurer votre application

Ouvrez le fichier : `src/environments/environment.ts`

Remplacez `'YOUR_API_KEY'` par votre clé personnelle :

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.balldontlie.io/v1',
  apiKey: 'VOTRE_CLE_API_ICI'
};
```

### 4. Redémarrer le serveur

```bash
npm start
```

## ✅ Vérification

Une fois configuré, vous devriez voir les joueurs s'afficher sur http://localhost:4200/players

## 🔒 Sécurité

⚠️ **NE COMMITTEZ JAMAIS votre clé API dans Git !**

Le fichier `environment.ts` devrait être ajouté au `.gitignore` en production.

## 📚 Documentation API

Pour plus d'informations : https://docs.balldontlie.io/
