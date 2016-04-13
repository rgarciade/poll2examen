import { CREATE_ACTION_CONFIRMATION, REMOVE_ACTION_CONFIRMATION } from './action-types.js';

export function createAction(rem) {
  return { type: CREATE_ACTION_CONFIRMATION, msg: rem.msg, confirmAction: rem.action, state: rem.state };
}

function removeAction(pendingAction) {
  return { type: REMOVE_ACTION_CONFIRMATION, pendingAction };
}

export function cancelAction(action) {
  return dispatch => dispatch(removeAction(action));
}

export function confirmAction(action) {
  return dispatch => {
    dispatch(removeAction(action));
    action.confirmAction();
   };
}
