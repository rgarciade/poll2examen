import {
  SET_POLLS,
  ADD_POLL_ERROR,
  REMOVE_POLL_ERROR,
  POLL_STATES,
  SET_STATE_POLL_ERROR
} from './action-types';

import { createAction } from '../confirm';
import Firebase from 'firebase';

export function setPolls(polls) {
  return { type: SET_POLLS, polls };
}

export function addPoll(title) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    const newPollRef = firebase.child('polls')
      .push({ title, state: 'locked', createdAt: Firebase.ServerValue.TIMESTAMP }, error => {
        if (error) {
          console.error('ERROR @ addPoll :', error); // eslint-disable-line no-console
          dispatch({
            type: ADD_POLL_ERROR,
            payload: error,
        });
      } else {
        const pollId = newPollRef.key();
        const userId = auth.id;
        firebase.child(`myPolls/${userId}/${pollId}`).set({ state: 'locked', createdAt: Firebase.ServerValue.TIMESTAMP });
      }
    });
  };
}

export function removePoll(poll) {
  return (dispatch, getState) => {
  let rem = {
      id: poll.id,
      title: poll.title,
      state: poll.state,
      msg: `Are you sure you want to delete de poll with titleee "${poll.title}"?`,
      action: () => {
        const { firebase, auth } = getState();
        firebase.child(`polls/${poll.id}`)
          .remove(error => {
            if (error) {
              console.error('ERROR @ removePoll :', error); // eslint-disable-line no-console
              dispatch({
                type: REMOVE_POLL_ERROR,
                payload: error,
              });
            } else {
              const userId = auth.id;
              firebase.child(`myPolls/${userId}/${poll.id}`).remove();
            }
          });
        }
    };
    dispatch(createAction(rem));
  };
}
export function setNextState(idPoll, actualState) {
  const nextState = POLL_STATES[actualState];
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    firebase.child(`myPolls/${auth.id}/${idPoll}`)
      .update({state: nextState}, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: SET_STATE_POLL_ERROR,
            payload: error,
        });
      } else {
        firebase.child(`polls/${idPoll}`).update({state: nextState});
      }
    });
  };
}
