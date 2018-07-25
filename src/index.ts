import {TVmazeAPI} from './services/TVmazeAPI';
import showStorage from './services/ShowsStorage';
import {API_URL, SERVER_PORT} from './services/Config';
import * as express from 'express';
import indexRouter from './routes/Index';
import * as mongoose from "mongoose";

const app = express();
app.use('/', indexRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port: ${SERVER_PORT}`);
});

mongoose.connect('mongodb://127.0.0.1:27017/tvm', {useNewUrlParser: true});
const {connection} = mongoose;
connection.on('error', (err) => {
  throw err;
});
connection.once('open', () => {
  console.log('Connected to db!');
});

updateDb();

async function updateDb() {
  const isDbFilled = await showStorage.checkShows();
  if (!isDbFilled) {
    console.log('DB is empty! Filling the db ...');
    const tvmazeApi = new TVmazeAPI(API_URL);
    const fetchedShows = await tvmazeApi.fetchShows();
    showStorage.saveShows(fetchedShows);
  }
}