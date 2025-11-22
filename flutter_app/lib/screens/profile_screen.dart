import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Mon profil',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const CircleAvatar(child: Icon(Icons.person)),
                title: Text(
                  user?.email ?? 'Utilisateur',
                  style: const TextStyle(color: Colors.white),
                ),
                subtitle: Text(
                  'UID : ${user?.uid ?? 'non connecté'}',
                  style: const TextStyle(color: Colors.white70),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Cette vue utilise Firebase Auth pour savoir qui est connecté. '
                'Ajoutez d\'autres attributs (nom, rôle, photo) dans Firestore si nécessaire.',
                style: TextStyle(color: Colors.white70),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
