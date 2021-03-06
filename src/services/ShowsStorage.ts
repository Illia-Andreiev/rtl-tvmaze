import {SHOW_PER_PAGE} from './Config';
import * as mongoose from 'mongoose';
import {PaginateResult, Schema} from 'mongoose';
import {FetchedShow} from '../interfaces/FetchedShow';
import {ShowModel} from '../interfaces/ShowModel';
import * as mongoosePaginate from 'mongoose-paginate';
import {PaginatedShowModel} from '../interfaces/PaginatedShowModel';
import {MongoError} from 'mongodb';
import {logger} from './Logger';

class ShowsStorage {

  private static instance: ShowsStorage;

  private constructor(private model: PaginatedShowModel) {
  }

  static getInstance(): ShowsStorage {
    if (!ShowsStorage.instance) {

      const tvmShowSchema = new Schema({
        id: Number,
        name: String,
        cast: [{
          id: Number,
          name: String,
          birthday: String
        }]
      });

      tvmShowSchema.plugin(mongoosePaginate);

      const tvmShowModel = mongoose.model<ShowModel>('tvmShowModel', tvmShowSchema);

      ShowsStorage.instance = new ShowsStorage(tvmShowModel);
    }
    return ShowsStorage.instance;
  }

  public saveShows(data: FetchedShow[]): void {
    this.model.collection.insertMany(data).catch((error: MongoError) => {
      logger.error(error);
    });
  }

  public getPage(page: number): Promise<string | void> {
    return this.model.paginate({}, {select: '-_id', page: page, limit: SHOW_PER_PAGE})
      .then((shows: PaginateResult<ShowModel>) => {
        return JSON.stringify(shows.docs);
      }).catch((error: Error) => {
        logger.error(error);
      });
  }

  public getShows(): Promise<string | void> {
    return this.model.find({}, '-_id').then((shows: ShowModel[]) => {
      return JSON.stringify(shows);
    }).catch((error: Error) => {
      logger.error(error);
    });
  }

  public checkShows(): Promise<Boolean> {
    return this.model.find({}).then((shows: ShowModel[]) => !!shows.length);
  }
}

export default ShowsStorage.getInstance();