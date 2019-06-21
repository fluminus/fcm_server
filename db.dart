import 'package:luminus_api/luminus_api.dart';
import 'package:dotenv/dotenv.dart' show load, env;

List<Notification> notifications = [];

Map<String, List<Notification>> db = {};

Future<void> addUser(String id) async {
  db[id] = [];
}

Future<void> removeUser(String id) async {
  db.remove(id);
}

Future<List<String>> getUsers() async {
  return db.keys.toList();
}

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

Authentication auth = Authentication(
      password: env['LUMINUS_PASSWORD'], username: env['LUMINUS_USERNAME']);

Future<Authentication> getStoredAuth(String id) async {
  load();
  return id == env['LUMINUS_USERNAME'] ? auth : null;
}
