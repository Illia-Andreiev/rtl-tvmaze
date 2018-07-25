import {Document, PaginateModel} from 'mongoose';
import {FetchedShow} from './FetchedShow';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface ShowModel extends Document, Omit<FetchedShow, 'id'> {

}

