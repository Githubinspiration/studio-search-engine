import { mockPeopleEntity } from '@studio-ghibli-search-engine/models';
import {
  initialRootState,
  RootState,
} from '@studio-ghibli-search-engine/store';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';

import PeopleListItem from './people-list-item';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children }: any) => <div>{children}</div>,
}));

describe('PeopleListItem', () => {
  const mockStore = configureStore<RootState>([]);

  let store: MockStoreEnhanced;

  beforeEach(() => {
    store = mockStore(initialRootState as any);
    store.dispatch = jest.fn();
  });
  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <PeopleListItem people={mockPeopleEntity} getFilmTitle={jest.fn()} />
      </Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
