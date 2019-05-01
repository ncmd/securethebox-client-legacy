import axios from 'axios';

export const manageChallenge = (clusterName, userName,action) => async dispatch => {
    let data = { clusterName: clusterName, userName:userName,action:action }
    axios.post('http://localhost:5000/api/kubernetes/challenges/1', data);
  }
