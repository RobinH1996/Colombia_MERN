import {    SET_AUTH
        } from "../constants/actionTypes";

export default (state = {email: false, psw: false}, action) => {
    switch (action.type) {
        case SET_AUTH:
            return { ...state, email: action.data.email, psw: action.data.psw};
        default:
            return state;
    }
};
