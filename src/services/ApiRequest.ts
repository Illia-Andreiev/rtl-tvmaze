import {get, IncomingMessage} from 'http';
import fetch, {Response} from 'node-fetch';

export class ApiResponseError extends Error {
  constructor(public statusCode: number) {
    super(`Request Failed. Status Code: ${statusCode}`);
  }
}

export class ApiRequest {
  static get<T>(path: string): Promise<T> {

    return fetch(path)
      .then((res: Response) => {
        if (!res.ok) {
          return Promise.reject(new ApiResponseError(res.status));
        }

        return res.json();
      },(err) => {
        return Promise.reject(err);
      });


    /*return new Promise((resolve, reject) => {
      get(path, (response: IncomingMessage) => {
        const {statusCode} = response;

        if (statusCode !== 200) {
          reject(new ApiResponseError(statusCode));
          response.resume();
          return;
        }

        response.setEncoding('utf8');
        let loadedData = '';
        response.on('data', function (chunk) {
          loadedData += chunk;
        });

        response.on('end', function () {
          resolve(JSON.parse(loadedData));
        });

      }).on('error', (e) => {
        reject(new ApiRequestError(e));
      });
    });*/
  }
}