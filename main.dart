import 'package:dio/dio.dart';
import 'package:luminus_api/luminus_api.dart';
import 'package:angel_framework/angel_framework.dart';
import 'package:angel_framework/http.dart';
import 'db.dart';

int _threshold = 10;
int _port = 4004;

main() async {
  /// Server part
  var app = Angel();
  var http = AngelHttp(app);
  app.get('/activate', (req, res) async {
    await addUser(req.queryParameters['id']);
    res.write('success');
    print('adduser ${req.queryParameters['id']}');
  });
  app.get('/deactivate', (req, res) async {
    await removeUser(req.params['id']);
  });
  await http.startServer('127.0.0.1', _port);

  /// Check updates part
  List<String> ids = await getUsers();
  var stream = Stream<void>.periodic(Duration(seconds: 2), (int v) async {
    if (ids.length == 0 || v == 0 || (ids.length != 0 && v % ids.length == 0)) {
      ids = await getUsers();
    }
    if (!ids.isEmpty) {
      var auth = await getStoredAuth(ids[v % ids.length]);
      var latest = await API.getNotifications(auth,
          limit: _threshold, sortby: 'recordDate%20desc');
      var updates = await getUpdates(auth.username, latest);
      if (!updates.isEmpty) {
        Dio dio = Dio();
        for (var item in updates) {
          print(item);
          await dio.get('http://127.0.0.1:3004/send', queryParameters: {
            'id': auth.username,
            'title': item.type,
            'body': item.notifyMessage
          });
        }
      }
    }
  });
  stream.forEach((var a) {});
}
