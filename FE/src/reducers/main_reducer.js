import {    SET_RESTS,
    SET_SEL_NUM
} from "../constants/actionTypes";

const defaultVal = {
    rests: [],
    selNum: false,
    totalnum: 0
};

export default (state = defaultVal, action) => {
    switch (action.type) {
        case SET_RESTS:
            return { ...state, rests: [...action.data.rests], totalNum: action.data.totalNum};
        case SET_SEL_NUM:
            return { ...state, selNum: action.data};
        default:
            return state;
    }
};
