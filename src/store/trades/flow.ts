import { SagaIterator } from 'redux-saga';
import { fork, put, call, takeEvery, take } from 'redux-saga/effects';
import { createFirestoreSyncChannel } from '../../services/db';
import { showSnackbar } from '../actions';
import firestore from '@react-native-firebase/firestore';
import { TradeData, Trades, TradesActionTypes } from './models';
import { syncTrades, syncTradesSuccess } from './actions';
import { AuthActionTypes } from '../auth/models';
import { watchSyncActiveBotsSuccessFlow } from '../activeBots/flow';
import { ActionType } from 'typesafe-actions';

export function* onSyncTradesChannelFlow(botId: string, data: TradeData[]) {
  // attach botId and return an object
  const newData: Trades = {};
  data.forEach((trade) => {
    newData[trade.id] = {
      ...trade,
      botId: botId,
    };
  });

  yield put(syncTradesSuccess(newData));
}
export function* onSyncTradesFlow(
  action: ActionType<typeof syncTrades>,
): SagaIterator {
  try {
    const { botId } = action.payload;
    const ref = firestore().collection('bots').doc(botId).collection('trades');
    const channel = yield call(createFirestoreSyncChannel, ref);

    yield takeEvery(channel, (data: TradeData[]) =>
      onSyncTradesChannelFlow(botId, data),
    );

    // TODO: this isn't working entirely, still getting firestore permission errors
    yield take(AuthActionTypes.SIGN_OUT_SUCCESS);
    channel.close();
  } catch (error) {
    yield put(showSnackbar(error.message));
  }
}

export function* watchSyncTradesFlow(): SagaIterator {
  yield takeEvery(TradesActionTypes.SYNC_TRADES, onSyncTradesFlow);
}

export function* tradesFlow(): SagaIterator {
  yield fork(watchSyncTradesFlow);
  yield fork(watchSyncActiveBotsSuccessFlow, syncTrades);
}
