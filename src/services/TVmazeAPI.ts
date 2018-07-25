import {ApiRequest, ApiResponseError} from './ApiRequest';
import {ATTEMPTS_NUMBER} from './Config';
import {FetchedShow} from '../interfaces/FetchedShow';
import {ShowResponse} from '../interfaces/ShowResponse';
import {CastResponse} from '../interfaces/CastResponse';

export class TVmazeAPI {
  constructor(private apiURL: string) {
  }

  private loadData<T>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
      function retry(attempt: number): void {
        ApiRequest.get(path)
          .then(resolve)
          .catch((error: ApiResponseError) => {
              if (error.statusCode === 429 && attempt !== 0) {
                retry(attempt--);
              } else {
                reject(error);
              }
            }
          );
      }

      retry(ATTEMPTS_NUMBER);
    });
  }

  private sortDateBirthday(a: string, b: string): number {
    if (a === null) {
      return 1;
    }
    if (b === null) {
      return -1;
    }
    return Date.parse(b) - Date.parse(a);
  }

  public async fetchShows(): Promise<FetchedShow[]> {
    const showsDto = await this.loadData<ShowResponse[]>(`${this.apiURL}/shows`);
    const mappedShowPromises = showsDto.map((show) => {
      return this.loadData<CastResponse[]>(`${this.apiURL}/shows/${show.id}/cast`)
        .then((castDto) => {
          let cast = castDto.map((item) => ({
            id: item.person.id,
            name: item.person.name,
            birthday: item.person.birthday
          }));

          cast.sort((a, b) => this.sortDateBirthday(a.birthday, b.birthday));

          return {
            id: show.id,
            name: show.name,
            cast,
          }
        });
    });
    return await Promise.all(mappedShowPromises);
  }
}