import * as actionTypes from './types.js';

export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user,
    }
  }
}

export const clearUser = () => (
  {
    type: actionTypes.CLEAR_USER,
  }
)

export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  }
}