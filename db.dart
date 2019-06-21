import 'package:luminus_api/luminus_api.dart';

List<Notification> notifications = [];

Map<String, List<Notification>> db = {'e0261956': []};

List<Notification> getUpdates(String userId, List<Notification> latest) {
  final List<Notification> stored = db[userId];
  List<Notification> updates = [];
  if (stored == null) {
    // TODO: error handling
    throw Exception();
  }
  for (var n in latest) {
    if (!stored.contains(n)) {
      updates.add(n);
    }
  }
  db[userId] = latest;
  return updates;
}
