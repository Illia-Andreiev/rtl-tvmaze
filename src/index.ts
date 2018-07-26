import {TVmazeAPI} from './services/TVmazeAPI';
import showStorage from './services/ShowsStorage';
import {API_URL, DB_NAME, DB_HOST, SERVER_PORT, DB_PORT} from './services/Config';
import * as express from 'express';
import indexRouter from './routes/Index';
import * as mongoose from 'mongoose';
import {MongoError} from 'mongodb';
import {logger} from './services/Logger';

const app = express();
app.use('/', indexRouter);

app.listen(SERVER_PORT, () => {
  logger.info(`Server listening on port: ${SERVER_PORT}`);
});

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {useNewUrlParser: true});
const {connection} = mongoose;
connection.on('error', (err: MongoError) => {
  logger.error(err);
});
connection.once('open', () => {
  logger.info('Connected to db!');
  updateDb();
});

async function updateDb(): Promise<void> {
  const isDbFilled = await showStorage.checkShows();
  if (!isDbFilled) {
    logger.info('DB is empty! Filling the db ...');
    const tvmazeApi = new TVmazeAPI(API_URL);
    const fetchedShows = await tvmazeApi.fetchShows();
    showStorage.saveShows(fetchedShows);
  }
}