# Guide de Déploiement CRM Pro

Guide complet pour publier votre application CRM Pro sur Google Play Store et Apple App Store.

## 📋 Informations de l'Application

- **Nom**: CRM Pro
- **ID**: com.tokan.mbsmanager
- **Version**: 1.0.0
- **Version Code**: 1

## 🔧 Prérequis

### Pour Android
- Android Studio installé
- Compte Google Play Developer (99$ one-time)
- JDK 17 ou supérieur

### Pour iOS
- macOS avec Xcode installé
- Compte Apple Developer (99$/an)
- Certificats et profils de provisionnement

## 📱 Déploiement Android (Google Play Store)

### 1. Préparer le Build

```bash
# Construire l'application web
npm run build

# Synchroniser avec Capacitor
npx cap sync android

# Ouvrir dans Android Studio
npx cap open android
```

### 2. Créer une Clé de Signature

Dans Android Studio ou en ligne de commande:

```bash
keytool -genkey -v -keystore crm-pro-release.keystore -alias crm-pro -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANT**: Sauvegardez cette clé en lieu sûr! Vous en aurez besoin pour toutes les futures mises à jour.

### 3. Configurer la Signature

Créez le fichier `android/key.properties`:

```properties
storePassword=VOTRE_MOT_DE_PASSE
keyPassword=VOTRE_MOT_DE_PASSE
keyAlias=crm-pro
storeFile=/chemin/vers/crm-pro-release.keystore
```

Ajoutez à `android/app/build.gradle` (avant `android {`):

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Modifiez la section `buildTypes`:

```gradle
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}

signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
```

### 4. Générer l'APK ou l'AAB

Dans Android Studio:
1. Menu: Build → Generate Signed Bundle / APK
2. Choisir "Android App Bundle" (AAB) - **Recommandé pour le Play Store**
3. Sélectionner votre keystore
4. Sélectionner "release"
5. Le fichier sera généré dans `android/app/release/`

Ou en ligne de commande:
```bash
cd android
./gradlew bundleRelease
```

### 5. Publier sur Google Play Console

1. Allez sur https://play.google.com/console
2. Créez une nouvelle application
3. Remplissez les informations:
   - **Titre**: CRM Pro - MBS Manager
   - **Description courte**: Application CRM professionnelle pour la gestion des stocks, clients et commandes
   - **Description complète**: (Détaillez les fonctionnalités)
   - **Catégorie**: Business
   - **Captures d'écran**: Minimum 2 (téléphone), recommandé 4-8

4. Configuration du contenu:
   - Classification du contenu
   - Public cible
   - Politique de confidentialité (obligatoire)

5. Upload de l'AAB:
   - Production → Créer une nouvelle version
   - Upload: `android/app/release/app-release.aab`

6. Soumettre pour examen (délai: 1-7 jours)

## 🍎 Déploiement iOS (App Store)

### 1. Préparer le Build

```bash
# Construire l'application web
npm run build

# Synchroniser avec Capacitor
npx cap sync ios

# Ouvrir dans Xcode
npx cap open ios
```

### 2. Configuration dans Xcode

1. Sélectionnez le projet "App" dans le navigateur
2. Dans l'onglet "Signing & Capabilities":
   - Cochez "Automatically manage signing"
   - Sélectionnez votre Team (compte développeur)
   - Bundle Identifier: `com.crmpro.app`

3. Dans "General":
   - Display Name: `CRM Pro`
   - Version: `1.0.0`
   - Build: `1`

### 3. Créer l'App dans App Store Connect

1. Allez sur https://appstoreconnect.apple.com
2. My Apps → Bouton "+" → New App
3. Remplissez:
   - Platform: iOS
   - Name: CRM Pro
   - Primary Language: French
   - Bundle ID: com.crmpro.app
   - SKU: com.crmpro.app
   - User Access: Full Access

### 4. Archiver et Upload

Dans Xcode:
1. Sélectionnez "Any iOS Device (arm64)" dans les destinations
2. Menu: Product → Archive
3. Une fois terminé, cliquez sur "Distribute App"
4. Sélectionnez "App Store Connect"
5. Suivez l'assistant jusqu'à l'upload

### 5. Soumettre pour Examen

Dans App Store Connect:
1. Sélectionnez votre build uploadé
2. Remplissez toutes les sections requises:
   - Captures d'écran (iPhone 6.7" et 6.5" obligatoires)
   - Description
   - Mots-clés
   - URL de support
   - Politique de confidentialité
   - Catégorie: Business

3. Cliquez sur "Submit for Review"
4. Délai d'examen: 1-3 jours généralement

## 🔐 Variables d'Environnement

**IMPORTANT**: Votre `.env` contient les clés Supabase. Pour la production:

1. **Ne jamais commiter le fichier `.env`** (déjà dans .gitignore)
2. Les variables sont compilées dans le build web
3. Pour plus de sécurité, considérez:
   - Row Level Security (RLS) sur Supabase ✅ (déjà configuré)
   - API Routes pour les opérations sensibles
   - Rotation régulière des clés

## 📸 Captures d'Écran Recommandées

Pour les stores, préparez:
1. Écran de connexion
2. Tableau de bord avec statistiques
3. Liste des produits/inventaire
4. Gestion des commandes
5. Profil client
6. Vue mobile de la navigation

Dimensions:
- **Android**: 1080x1920 (portrait), 1920x1080 (landscape)
- **iOS**: 1290x2796 (iPhone 14 Pro Max), 1242x2688 (iPhone 11 Pro Max)

## 🔄 Mises à Jour Futures

Pour publier une mise à jour:

### Android
1. Incrémenter `versionCode` dans `android/app/build.gradle`
2. Mettre à jour `versionName` si nécessaire
3. Reconstruire et re-signer l'AAB
4. Upload sur Play Console

### iOS
1. Incrémenter la version/build dans Xcode
2. Archive et upload comme la première fois
3. Soumettre pour examen

### Code Web
```bash
npm run build
npx cap sync
# Puis suivre les étapes ci-dessus
```

## 📝 Checklist de Publication

### Avant de soumettre:
- [ ] Tester l'app sur plusieurs appareils
- [ ] Vérifier tous les flux (connexion, CRUD, etc.)
- [ ] Préparer les captures d'écran
- [ ] Rédiger une description attrayante
- [ ] Créer une politique de confidentialité
- [ ] Créer une page de support
- [ ] Tester la connexion Supabase en production
- [ ] Vérifier les permissions requises

### Informations légales:
- [ ] Politique de confidentialité (obligatoire)
- [ ] Conditions d'utilisation (recommandé)
- [ ] Contact support (obligatoire)

## 🆘 Résolution de Problèmes

### Erreur: "App not installed"
- Désinstaller l'ancienne version
- Vérifier la signature de l'APK

### iOS: "Untrusted Developer"
- Settings → General → VPN & Device Management
- Approuver le profil développeur

### Build échoue
```bash
# Nettoyer et reconstruire
cd android
./gradlew clean

# ou pour iOS, dans Xcode:
# Product → Clean Build Folder
```

## 📞 Support

Pour toute question:
- Documentation Capacitor: https://capacitorjs.com/docs
- Google Play Console: https://support.google.com/googleplay/android-developer
- App Store Connect: https://developer.apple.com/app-store-connect/

## 🎉 Prochaines Étapes

Après publication:
1. Configurer les notifications push (Firebase/APNs)
2. Mettre en place l'analytics (Firebase Analytics)
3. Ajouter le crash reporting
4. Planifier les mises à jour régulières
5. Répondre aux avis utilisateurs

Bonne chance avec votre publication! 🚀
