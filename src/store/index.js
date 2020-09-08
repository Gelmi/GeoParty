import { createStore } from 'redux';

const INITIAL_STATE = {
    socket: null,
    players: [],
    user: {},
};

function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'PLAYER_SOCKET':
            return { ...state, socket: action.socket};
        case 'PLAYER_LOGIN':
            return { ...state, players: action.players, user: action.user};
        case 'PLAYER_LOGGED': 
            return { ...state, players: action.data};
        case 'PLAYER_MARKED':
            return { ...state, players: action.players};
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;