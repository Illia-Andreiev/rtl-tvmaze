import {TVmazeAPI} from './services/TVmazeAPI';
import showStorage from './services/ShowsStorage';
import {API_URL, DB_NAME, DB_HOST, SERVER_PORT, DB_PORT} from './services/Config';
import * as express from 'express';
import indexRouter from './routes/Index';
import * as mongoose from 'mongoose';
import {MongoError} from 'mongodb';

const app = express();
app.use('/', indexRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port: ${SERVER_PORT}`);
});

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {useNewUrlParser: true});
const {connection} = mongoose;
connection.on('error', (err: MongoError) => {
  throw err;
});
connection.once('open', () => {
  console.log('Connected to db!');
  updateDb();
});

async function updateDb(): Promise<void> {
  const isDbFilled = await showStorage.checkShows();
  if (!isDbFilled) {
    console.log('DB is empty! Filling the db ...');
    const tvmazeApi = new TVmazeAPI(API_URL);
    const fetchedShows = await tvmazeApi.fetchShows();
    showStorage.saveShows(fetchedShows);
  }
}