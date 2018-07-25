import {SHOW_PER_PAGE} from '../Constant';
import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {FetchedShow} from '../interfaces/FetchedShow';
import {ShowModel} from '../interfaces/ShowModel';
import * as mongoosePaginate from 'mongoose-paginate';
import {PaginatedShowModel} from '../interfaces/PaginatedShowModel';

class ShowStorage {

  private static instance: ShowStorage;

  private constructor(private model: PaginatedShowModel) {}

  static getInstance() {
    if (!ShowStorage.instance) {

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

      ShowStorage.instance = new ShowStorage(tvmShowModel);
    }
    return ShowStorage.instance;
  }

  public saveCast(data: FetchedShow[]): void {
    /*fs.writeFile(STORAGE_FILE, JSON.stringify(data), 'utf8', (err => {
      if (err) throw err;
    }));*/

    this.model.collection.insertMany(data, function (err) {
      if (err) {
        throw err;
      }
    });
  }

  public getPage(page: number): Promise<string> {
    /*return this.getShows().then((cast) => {
      return JSON.stringify(JSON.parse(cast).slice(page * SHOW_PER_PAGE - SHOW_PER_PAGE, page * SHOW_PER_PAGE));
    });*/

    return this.model.paginate({}, {page: page, limit: SHOW_PER_PAGE})
      .then((shows) => {
        return JSON.stringify(shows.docs);
      });
  }

  public getShows(): Promise<string> {
    /*return new Promise((resolve, reject) => {
      fs.readFile(STORAGE_FILE, 'utf8', function (err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });*/

    return this.model.find({}, '-_id').then((shows) => {
      return JSON.stringify(shows);
    });

  }
}

export default ShowStorage.getInstance();