# Guide de Déploiement Mobile - CRM Pro

Votre application CRM a été configurée pour iOS et Android avec Capacitor.

## Structure du Projet

```
project/
├── ios/              # Projet Xcode pour iOS
├── android/          # Projet Android Studio
├── capacitor.config.json
└── resources/        # Icônes et splash screens
```

## Prérequis

### Pour iOS
- **Mac avec macOS** (obligatoire)
- **Xcode** (dernière version depuis App Store)
- **Compte Apple Developer** (99$/an)
- **CocoaPods**: `sudo gem install cocoapods`

### Pour Android
- **Android Studio** (Windows/Mac/Linux)
- **Java JDK** 17 ou supérieur
- **Compte Google Play Developer** (25$ une fois)

## Étapes de Déploiement

### 1. Préparer les Ressources

#### Icône de l'Application
Créez une icône de **1024x1024 pixels** (PNG avec fond transparent ou couleur unie):
- Remplacez `resources/icon.png`

#### Écran de Démarrage (Splash Screen)
Créez un splash de **2732x2732 pixels** (PNG):
- Remplacez `resources/splash.png`

### 2. Générer les Ressources

```bash
npm install -g @capacitor/assets
npx capacitor-assets generate
```

### 3. Build de l'Application Web

Avant chaque déploiement mobile, buildez votre app web:

```bash
npm run build
npx cap sync
```

## Déploiement iOS (App Store)

### Configuration Initiale

1. **Ouvrir le projet dans Xcode**:
   ```bash
   npx cap open ios
   ```

2. **Configuration dans Xcode**:
   - Ouvrez le fichier `App.xcworkspace`
   - Sélectionnez le projet "App" dans le navigateur
   - Dans "Signing & Capabilities":
     - Activez "Automatically manage signing"
     - Sélectionnez votre Team (compte Apple Developer)
     - Changez le Bundle Identifier si nécessaire (ex: com.votreentreprise.crmpro)

3. **Paramètres de l'App**:
   - **Display Name**: CRM Pro
   - **Version**: 1.0.0
   - **Build**: 1
   - **Deployment Target**: iOS 13.0 minimum

### Tester sur Simulateur

```bash
# Dans Xcode
Produit > Destination > Choisir un simulateur
Produit > Exécuter (Cmd+R)
```

### Tester sur un Appareil Réel

1. Connectez votre iPhone/iPad via USB
2. Sélectionnez-le dans Xcode
3. Cliquez sur "Exécuter"
4. Sur l'appareil: Réglages > Général > Gestion des appareils > Faire confiance au développeur

### Soumettre à l'App Store

1. **Créer l'App dans App Store Connect**:
   - Allez sur [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Mes Apps > + > Nouvelle App
   - Remplissez les infos (nom, bundle ID, etc.)

2. **Archiver l'App**:
   ```
   Dans Xcode:
   - Produit > Destination > Any iOS Device
   - Produit > Archive
   - Attendez la fin de l'archive
   ```

3. **Uploader l'Archive**:
   - Fenêtre Organizer s'ouvre
   - Sélectionnez votre archive
   - Cliquez "Distribute App"
   - Choisissez "App Store Connect"
   - Suivez l'assistant

4. **Soumettre pour Révision**:
   - Retournez dans App Store Connect
   - Complétez les captures d'écran, description, etc.
   - Soumettez pour révision (délai: 24-48h généralement)

## Déploiement Android (Google Play)

### Configuration Initiale

1. **Ouvrir le projet dans Android Studio**:
   ```bash
   npx cap open android
   ```

2. **Configurer l'Application**:

   Modifiez `android/app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           applicationId "com.votreentreprise.crmpro"
           minSdkVersion 22
           targetSdkVersion 34
           versionCode 1
           versionName "1.0.0"
       }
   }
   ```

3. **Nom de l'App**:

   Modifiez `android/app/src/main/res/values/strings.xml`:
   ```xml
   <string name="app_name">CRM Pro</string>
   ```

### Tester sur Émulateur

1. Dans Android Studio: Tools > Device Manager
2. Créez un AVD (Android Virtual Device)
3. Lancez l'émulateur
4. Cliquez sur "Run" (triangle vert)

### Tester sur un Appareil Réel

1. Activez le "Mode Développeur" sur votre Android:
   - Paramètres > À propos du téléphone
   - Appuyez 7 fois sur "Numéro de build"
2. Activez "Débogage USB"
3. Connectez via USB
4. Autorisez le débogage USB
5. Cliquez "Run" dans Android Studio

### Créer un APK de Production

1. **Générer une Clé de Signature**:
   ```bash
   keytool -genkey -v -keystore crmpro-release-key.keystore \
     -alias crmpro -keyalg RSA -keysize 2048 -validity 10000
   ```

   **IMPORTANT**: Sauvegardez cette clé en lieu sûr!

2. **Configurer la Signature**:

   Créez `android/key.properties`:
   ```properties
   storePassword=VotreMotDePasse
   keyPassword=VotreMotDePasse
   keyAlias=crmpro
   storeFile=../crmpro-release-key.keystore
   ```

   Modifiez `android/app/build.gradle`:
   ```gradle
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }

   android {
       signingConfigs {
           release {
               keyAlias keystoreProperties['keyAlias']
               keyPassword keystoreProperties['keyPassword']
               storeFile file(keystoreProperties['storeFile'])
               storePassword keystoreProperties['storePassword']
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. **Builder l'APK/AAB**:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

   Le fichier sera dans: `android/app/build/outputs/bundle/release/app-release.aab`

### Soumettre à Google Play

1. **Créer un Compte Google Play Console**:
   - Allez sur [play.google.com/console](https://play.google.com/console)
   - Payez les 25$ (une seule fois)

2. **Créer une Nouvelle Application**:
   - Cliquez "Créer une application"
   - Remplissez les informations de base

3. **Configurer l'App**:
   - Complétez toutes les sections obligatoires:
     - Fiche du Play Store (captures, description, icône)
     - Classification du contenu
     - Public cible
     - Confidentialité et sécurité
     - Tarification et distribution

4. **Créer une Version**:
   - Production > Créer une version
   - Uploadez votre fichier AAB
   - Complétez les notes de version
   - Examiner et déployer

5. **Révision**:
   - Google examine votre app (quelques heures à quelques jours)
   - Une fois approuvée, elle sera disponible sur le Play Store

## Mises à Jour

### Workflow de Mise à Jour

1. Modifiez votre code React
2. Testez en mode web: `npm run dev`
3. Buildez: `npm run build`
4. Synchronisez: `npx cap sync`
5. Testez sur mobile (simulateur/émulateur)
6. Incrémentez la version dans:
   - iOS: Xcode > General > Version & Build
   - Android: `build.gradle` > versionCode & versionName
7. Créez une nouvelle archive/build
8. Soumettez la mise à jour

## Variables d'Environnement

Les variables d'environnement (Supabase, etc.) sont accessibles dans l'app mobile.

Assurez-vous que `.env` est bien configuré avec:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

Ces variables sont incluses au moment du build web.

## Commandes Utiles

```bash
# Synchroniser après un build web
npx cap sync

# Ouvrir dans l'IDE natif
npx cap open ios
npx cap open android

# Mettre à jour Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/ios@latest @capacitor/android@latest
npx cap sync

# Logger les erreurs (débug)
npx cap run ios
npx cap run android
```

## Troubleshooting

### iOS

**Erreur de signature**:
- Vérifiez que vous avez un compte Apple Developer actif
- Assurez-vous que "Automatically manage signing" est activé
- Changez le Bundle ID si nécessaire

**CocoaPods**:
```bash
cd ios/App
pod install
```

### Android

**Gradle sync failed**:
- Tools > SDK Manager > Vérifiez que les SDK nécessaires sont installés
- Invalidate Caches / Restart dans Android Studio

**Erreur de signature**:
- Vérifiez que `key.properties` et la keystore existent
- Vérifiez les chemins dans `build.gradle`

## Ressources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Apple Developer](https://developer.apple.com)
- [Google Play Console](https://play.google.com/console)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

## Notes Importantes

1. **Testez toujours sur de vrais appareils** avant de soumettre
2. **Suivez les guidelines** des stores (design, contenu, permissions)
3. **Préparez des captures d'écran** pour les différentes tailles d'écrans
4. **Rédigez une bonne description** et choisissez les bons mots-clés
5. **Planifiez du temps pour les révisions** (Apple: 1-3 jours, Google: quelques heures)
6. **Sauvegardez votre keystore Android** - sans elle, vous ne pouvez plus mettre à jour votre app!

Bon déploiement! 🚀
