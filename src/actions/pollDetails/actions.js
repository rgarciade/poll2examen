import Firebase from 'firebase';
import {
  UPDATE_POLL_ERROR
} from './action-types';

export function editPollTitle(idPoll, title) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${idPoll}`)
      .update({title}, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
  };
}

export function addEntry(idPoll, title) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${idPoll}/entries`)
      .push({ title, votes: 0, createdAt: Firebase.ServerValue.TIMESTAMP }, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
  };
}

export function removeEntry(idPoll, idEntry) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${idPoll}/entries/${idEntry}`)
      .remove(error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
  };
}

export function voteEntry(poll, idEntry, auth) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${poll.id}/entries/${idEntry}/votes`)
      .transaction(votes => votes + 1, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
      firebase.child(`polls/${poll.id}/userslist/${auth.id}`)
      .set({id:auth.id, vote: idEntry});
      firebase.child(`users/${auth.id}/pollvotes/${poll.id}`)
      .set(poll.title);
  };
}
export function changeVoteEntry(poll, idEntry, auth) {
  return (dispatch, getState) => {
    const oldvote = poll.userslist[auth.id].vote;
    const { firebase } = getState();
    firebase.child(`polls/${poll.id}/entries/${oldvote}/votes`)
      .transaction(votes => votes - 1, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
    firebase.child(`polls/${poll.id}/entries/${idEntry}/votes`)
      .transaction(votes => votes + 1, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
      firebase.child(`polls/${poll.id}/userslist/${auth.id}`)
      .set({id:auth.id, vote: idEntry});
      debugger;
      firebase.child(`users/${auth.id}/${poll.id}`)
      .set(poll.title);
  };
}
