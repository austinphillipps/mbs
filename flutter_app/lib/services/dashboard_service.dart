import 'package:cloud_firestore/cloud_firestore.dart';

class DashboardSummary {
  const DashboardSummary({
    required this.productCount,
    required this.customerCount,
    required this.orderCount,
    required this.supplierCount,
  });

  final int productCount;
  final int customerCount;
  final int orderCount;
  final int supplierCount;
}

class DashboardService {
  DashboardService({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  final FirebaseFirestore _firestore;

  Future<DashboardSummary> loadSummary() async {
    final results = await Future.wait([
      _firestore.collection('products').count().get(),
      _firestore.collection('customers').count().get(),
      _firestore.collection('orders').count().get(),
      _firestore.collection('suppliers').count().get(),
    ]);

    return DashboardSummary(
      productCount: results[0].count,
      customerCount: results[1].count,
      orderCount: results[2].count,
      supplierCount: results[3].count,
    );
  }
}
