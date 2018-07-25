import * as nconf from 'nconf';

nconf
  .env()
  .file({ file: '../config.json' });

export const SERVER_PORT = +nconf.get('server:port');
export const ATTEMPTS_NUMBER = +nconf.get('api:attempts');
export const SHOW_PER_PAGE = +nconf.get('app:showsPerPage');
export const API_URL = nconf.get('api:url');




