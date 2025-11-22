# Configuration de la Base de Données MBS

## 🎯 Instructions Rapides

Votre application MBS est prête, mais la base de données doit être configurée. Suivez ces étapes simples:

### Étape 1: Accéder à l'éditeur SQL Supabase

Cliquez sur ce lien pour ouvrir l'éditeur SQL:
**https://0ec90b57d6e95fcbda19832f.supabase.co/project/default/sql**

### Étape 2: Copier le script SQL

Ouvrez le fichier `database-setup.sql` qui se trouve à la racine de votre projet et copiez TOUT son contenu.

### Étape 3: Exécuter le script

1. Collez le contenu dans l'éditeur SQL de Supabase
2. Cliquez sur le bouton **"RUN"** (en haut à droite)
3. Attendez quelques secondes que toutes les tables soient créées
4. Vous verrez un message de succès

### Étape 4: Créer votre premier utilisateur admin

Une fois les tables créées, vous devez:

1. **Créer un compte** via l'interface d'authentification Supabase:
   - Allez dans: Authentication > Users > Add User
   - Email: `admin@mbs.com` (ou votre email)
   - Mot de passe: choisissez un mot de passe sécurisé
   - Confirmez la création

2. **Attribuer le rôle admin** en exécutant ce SQL:
   ```sql
   INSERT INTO profiles (id, email, full_name, role)
   SELECT id, email, 'Administrateur MBS', 'admin'
   FROM auth.users
   WHERE email = 'admin@mbs.com';
   ```

## ✅ Vérification

Après ces étapes, vous pouvez:
- Vous connecter à l'application avec vos identifiants
- Accéder à toutes les fonctionnalités
- Commencer à ajouter des produits, clients et commandes

## 📊 Structure de la Base de Données

Votre base de données contient:

- **profiles** - Utilisateurs et leurs rôles (admin, manager, sales, warehouse)
- **categories** - Catégories de produits (Vins, Spiritueux, Bières, etc.)
- **suppliers** - Fournisseurs
- **products** - Catalogue de produits
- **inventory** - Niveaux de stock
- **customers** - Clients CRM (restaurants, hôtels, bars, commerces)
- **orders** - Commandes de vente
- **order_items** - Détails des commandes
- **stock_movements** - Historique des mouvements de stock
- **customer_interactions** - Historique des interactions clients

## 🔐 Sécurité

Toutes les tables sont protégées par Row Level Security (RLS) avec des politiques basées sur les rôles:
- **Admin**: Accès complet
- **Manager**: Gestion des produits, stocks, commandes et fournisseurs
- **Sales**: Gestion des clients et commandes
- **Warehouse**: Gestion des stocks

## 🆘 Besoin d'aide?

Si vous rencontrez des problèmes:
1. Vérifiez que toutes les tables ont été créées (onglet Database > Tables dans Supabase)
2. Vérifiez que RLS est activé sur toutes les tables
3. Assurez-vous d'avoir créé un profil utilisateur après l'inscription

## 🎉 C'est prêt!

Une fois la base de données configurée, votre application MBS Manager est entièrement opérationnelle!
