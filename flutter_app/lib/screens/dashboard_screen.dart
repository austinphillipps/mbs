import 'package:flutter/material.dart';

import '../services/dashboard_service.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final service = DashboardService();

    return FutureBuilder<DashboardSummary>(
      future: service.loadSummary(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        final summary = snapshot.data ??
            const DashboardSummary(
              productCount: 0,
              customerCount: 0,
              orderCount: 0,
              supplierCount: 0,
            );

        return GridView.count(
          padding: const EdgeInsets.all(16),
          crossAxisCount: MediaQuery.of(context).size.width > 640 ? 2 : 1,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            _MetricCard(
              title: 'Produits',
              value: summary.productCount,
              icon: Icons.inventory,
              color: Colors.cyan,
            ),
            _MetricCard(
              title: 'Clients',
              value: summary.customerCount,
              icon: Icons.people,
              color: Colors.purple,
            ),
            _MetricCard(
              title: 'Commandes',
              value: summary.orderCount,
              icon: Icons.shopping_bag,
              color: Colors.amber,
            ),
            _MetricCard(
              title: 'Fournisseurs',
              value: summary.supplierCount,
              icon: Icons.warehouse,
              color: Colors.teal,
            ),
          ],
        );
      },
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  final String title;
  final int value;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: color.withOpacity(0.2),
                  child: Icon(icon, color: color),
                ),
                const SizedBox(width: 12),
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const Spacer(),
            Text(
              '$value',
              style: const TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
