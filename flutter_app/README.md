# Application Flutter + Firebase

Cette version reconstruit l'expérience MBS en Flutter avec Firebase (Auth + Firestore).

## Pré-requis
- [Flutter](https://docs.flutter.dev/get-started/install) 3.5 ou plus
- [FlutterFire CLI](https://firebase.flutter.dev/docs/cli) pour générer `firebase_options.dart`
- Un projet Firebase avec Authentication (email/mot de passe) et Firestore activés

## Mise en route
1. Placez-vous dans `flutter_app/` :
   ```bash
   cd flutter_app
   ```
2. Configurez Firebase (génère `lib/firebase_options.dart` complet) :
   ```bash
   flutterfire configure --project <votre-projet>
   ```
3. Installez les dépendances :
   ```bash
   flutter pub get
   ```
4. Lancez l'application (web, iOS, Android ou desktop) :
   ```bash
   flutter run
   ```

## Collections Firestore attendues
- `products`: `{ name, sku, quantity }`
- `customers`: `{ name, email, city }`
- `orders`: `{ customer, status, total, createdAt }`
- `suppliers`: `{ name, email, phone }`

Les pages Dashboard/Analytics utilisent des requêtes d'agrégation `count()`, veillez à activer l'API correspondante dans Firebase si nécessaire.
