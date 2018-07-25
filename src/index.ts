import {TVmazeAPI} from './services/TVmazeAPI';
import showStorage from './services/ShowStorage';
import {API_URL, SERVER_PORT} from './Constant';
import * as express from 'express';
import indexRouter from './routes/index';
import * as mongoose from "mongoose";

const app = express();
app.use('/', indexRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port: ${SERVER_PORT}`);
});

mongoose.connect('mongodb://127.0.0.1:27017/tvm', {useNewUrlParser: true});
const {connection} = mongoose;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  console.log('Connected to db!');
});

updateDb();

async function updateDb() {
  const tvmazeApi = new TVmazeAPI(API_URL);
  const fetchedCast = await tvmazeApi.fetchShows();
  showStorage.saveCast(fetchedCast);
}


/*
tvmShowModel.create({
  id: 1,
  name: 'Name',
  cast: [{
    id: 1,
    name: 'Actor',
    birthday: '18.07/1994'
  }]
}, (err) => {
  if (err) throw new Error('Something wrong with saving document');
});*/
