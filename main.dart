import 'package:luminus_api/luminus_api.dart';
import 'package:angel_framework/angel_framework.dart';
import 'package:angel_framework/http.dart';
import 'db.dart';
import 'package:dotenv/dotenv.dart' show load, env;

int _threshold = 10;

main() async {
  load();
  Authentication auth = Authentication(
      password: env['LUMINUS_PASSWORD'], username: env['LUMINUS_USERNAME']);
  var app = Angel();
  var http = AngelHttp(app);
  app.get('/', (req, res) => res.write('Hello, world!'));
  await http.startServer('localhost', 4004);
  var stream = Stream<void>.periodic(Duration(seconds: 2), (int v) async {
    var latest = await API.getNotifications(auth,
        limit: _threshold, sortby: 'recordDate%20desc');
    print(await getUpdates(auth.username, latest));
  });
  stream.forEach((var a) {});
}
