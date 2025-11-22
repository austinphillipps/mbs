import 'package:flutter/material.dart';

import '../services/dashboard_service.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<DashboardSummary>(
      future: DashboardService().loadSummary(),
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

        final points = [
          _Point('Stocks', summary.productCount, Colors.cyan),
          _Point('Clients', summary.customerCount, Colors.purple),
          _Point('Commandes', summary.orderCount, Colors.amber),
          _Point('Fournisseurs', summary.supplierCount, Colors.teal),
        ];

        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text(
              'Aperçu de vos indicateurs',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: points
                      .map(
                        (point) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  point.label,
                                  style: const TextStyle(color: Colors.white70),
                                ),
                              ),
                              Container(
                                height: 12,
                                width: (point.value * 6).clamp(12, 160).toDouble(),
                                decoration: BoxDecoration(
                                  color: point.color,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Text('${point.value}',
                                  style: const TextStyle(color: Colors.white)),
                            ],
                          ),
                        ),
                      )
                      .toList(),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'Comment ça marche ?',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      '''Les métriques se basent sur les collections Firestore :
- products (stocks)
- customers
- orders
- suppliers
Vous pouvez enrichir les documents avec des attributs "quantity", "status" et "total" pour nourrir vos tableaux.''',
                      style: TextStyle(color: Colors.white70),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

class _Point {
  _Point(this.label, this.value, this.color);

  final String label;
  final int value;
  final Color color;
}
