import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class SuppliersScreen extends StatelessWidget {
  const SuppliersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
      stream: FirebaseFirestore.instance.collection('suppliers').snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        final docs = snapshot.data?.docs ?? [];
        if (docs.isEmpty) {
          return const Center(
            child: Text(
              'Ajoutez vos fournisseurs dans "suppliers" (nom, email, téléphone).',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70),
            ),
          );
        }

        return ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: docs.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final data = docs[index].data();
            final name = data['name'] as String? ?? 'Fournisseur';
            final phone = data['phone'] as String? ?? '';
            final email = data['email'] as String? ?? '';

            return Card(
              child: ListTile(
                leading: const Icon(Icons.factory, color: Colors.cyan),
                title: Text(name, style: const TextStyle(color: Colors.white)),
                subtitle: Text('$phone • $email', style: const TextStyle(color: Colors.white70)),
              ),
            );
          },
        );
      },
    );
  }
}
