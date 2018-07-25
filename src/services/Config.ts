import * as nconf from 'nconf';

nconf
  .env()
  .file({ file: '../config.json' });

/*nconf.set('app:showsPerPage', 5);
nconf.set('server:port', 3000);
nconf.set('api:attempts', 100);
nconf.set('api:url', 'http://api.tvmaze.com');
nconf.set('db:name', 'tvm');
nconf.set('db:host', '127.0.0.1');
nconf.set('db:port', 27017);


nconf.save(function (err) {
  if (err) throw err;
});*/

export const SERVER_PORT = +nconf.get('server:port');
export const ATTEMPTS_NUMBER = +nconf.get('api:attempts');
export const SHOW_PER_PAGE = +nconf.get('app:showsPerPage');
export const API_URL = nconf.get('api:url');
export const DB_HOST = nconf.get('db:host');
export const DB_NAME = nconf.get('db:name');
export const DB_PORT = +nconf.get('db:port');







