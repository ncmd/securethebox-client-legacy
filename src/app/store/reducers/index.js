import {combineReducers} from 'redux';
import fuse from './fuse';
import auth from 'app/auth/store/reducers';
import securethebox from './securethebox';

const createReducer = (asyncReducers) =>
    combineReducers({
        securethebox,
        auth,
        fuse,
        ...asyncReducers
    });

export default createReducer;
