export interface FetchedShow {
  id: number,
  name: string
  cast: {
    id: number,
    name: string,
    birthday: string
  }[]
}