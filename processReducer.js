import * as actionTypes from 'constants/experiment/actionTypes.constant';

 const initialState = {
     refreshData: {
         subscription: null
     }
 };

const processesReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REQUEST_REFRESH_DATA:
            return {
                ...state,
                refreshData: {
                    ...state.refreshData,
                    subscription: action.subscription
                }
            };
        case actionTypes.RECEIVE_REFRESH_DATA:
            return {
                ...state,
                refreshData: {
                    ...state.refreshData,
                    subscription: null
                }
            }
        default:
            return state;
    }
}

export default processesReducer;

