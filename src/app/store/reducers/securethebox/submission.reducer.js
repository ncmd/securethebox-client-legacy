// import * as Actions from '../../actions/securethebox/index';
import navigationConfig from 'app/fuse-configs/navigationConfig';
import {
  UPDATE_FORM_STATE
} from './types';

const initialState = navigationConfig;

const submission = function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_FORM_STATE:
          return {
            ...state,
            [action.form]: action.payload
          }
        default:
          return state
      }
};

export default submission;
