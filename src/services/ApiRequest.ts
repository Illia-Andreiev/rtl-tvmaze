import fetch, {Response} from 'node-fetch';
import {logger} from './Logger';

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
      });
  }
}