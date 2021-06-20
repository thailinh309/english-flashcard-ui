import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FETCH_WORD_BEGIN,
  HOME_FETCH_WORD_SUCCESS,
  HOME_FETCH_WORD_FAILURE,
  HOME_FETCH_WORD_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  fetchWord,
  dismissFetchWordError,
  reducer,
} from '../../../../src/features/home/redux/fetchWord';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchWord', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchWord succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchWord())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_WORD_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_WORD_SUCCESS);
      });
  });

  it('dispatches failure action when fetchWord fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchWord({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_WORD_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_WORD_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchWordError', () => {
    const expectedAction = {
      type: HOME_FETCH_WORD_DISMISS_ERROR,
    };
    expect(dismissFetchWordError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FETCH_WORD_BEGIN correctly', () => {
    const prevState = { fetchWordPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_WORD_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchWordPending).toBe(true);
  });

  it('handles action type HOME_FETCH_WORD_SUCCESS correctly', () => {
    const prevState = { fetchWordPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_WORD_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchWordPending).toBe(false);
  });

  it('handles action type HOME_FETCH_WORD_FAILURE correctly', () => {
    const prevState = { fetchWordPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_WORD_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchWordPending).toBe(false);
    expect(state.fetchWordError).toEqual(expect.anything());
  });

  it('handles action type HOME_FETCH_WORD_DISMISS_ERROR correctly', () => {
    const prevState = { fetchWordError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_WORD_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchWordError).toBe(null);
  });
});

