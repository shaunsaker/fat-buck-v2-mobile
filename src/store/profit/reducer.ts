import { Reducer } from 'redux';
import { REHYDRATE } from 'redux-persist';
import { ProfitActionTypes, ProfitState, ProfitTypes } from './models';

export const initialState: ProfitState = {
  loading: false,
  profitType: ProfitTypes.toDate,
  data: {
    ratio: 0,
    amount: 0,
    lastUpdated: '',
  },
};

export const profitReducer: Reducer<ProfitState> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...action.payload?.profit,
        loading: false,
      };
    }
    case ProfitActionTypes.SYNC_PROFIT: {
      return {
        ...state,
        loading: true,
      };
    }
    case ProfitActionTypes.SYNC_PROFIT_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    }
    case ProfitActionTypes.SYNC_PROFIT_ERROR: {
      return {
        ...state,
        loading: false,
      };
    }
    case ProfitActionTypes.SET_PROFIT_TYPE: {
      return {
        ...state,
        profitType: action.payload.profitType,
      };
    }
    default: {
      return state;
    }
  }
};
