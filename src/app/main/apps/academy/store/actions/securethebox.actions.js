// import axios from 'axios';

export const UPDATE_FORM_STATE = 'UPDATE_FORM_STATE';

export function updateFormState(form, state) {
    return (dispatch) =>
        dispatch({
            type: UPDATE_FORM_STATE,
            form,
            payload: state
        })
}
