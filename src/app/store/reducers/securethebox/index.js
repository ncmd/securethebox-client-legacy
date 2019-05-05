import {combineReducers} from 'redux';
import submission from './submission.reducer';
import finalFormReducer from './finalFormDuck'

const securetheboxReducers = combineReducers({
    submission,
    finalForm: finalFormReducer
});

export default securetheboxReducers;
