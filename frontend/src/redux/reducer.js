import * as types from "./actionTypes";

const initialState = {
    services: [],
    playbook: [],
    user: {},
    msg: ""
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_SERVICES:
            return {
                ...state,
                services: action.payload,
            };
        case types.GENERATE_PLAYBOOK:
            return {
                ...state,
                playbook: action.payload,
            }
        default:
            return state;
    }
};

export default userReducer;