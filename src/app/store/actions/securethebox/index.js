import axios from 'axios';
import {
  UPDATE_FORM_STATE
} from './types';

export const manageChallenge = (clusterName, userName,action) => async dispatch => {
    let data = { clusterName: clusterName, userName:userName, action:action }
    axios.post('http://localhost:5000/api/kubernetes/challenges/1', data);
  }


export const sendAnswers = (questionsAnswers) => async dispatch => {
  let data = { solutionData: questionsAnswers }
  axios.post('http://localhost:5000/api/solutions/challenges/1', data);

} 

export const updateFormState = (form, state) => ({
  type: UPDATE_FORM_STATE,
  form,
  payload: state
})