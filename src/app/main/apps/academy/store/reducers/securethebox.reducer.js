import * as Actions from '../actions';

const initialState = null;

const securetheboxReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.UPDATE_FORM_STATE:
            {
                return {
                    ...state,
                    [action.form]: action.payload
                };
            }

        default:
            {
                return state;
            }
    }
};

export default securetheboxReducer;

