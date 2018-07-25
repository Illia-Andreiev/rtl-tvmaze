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
  }
}