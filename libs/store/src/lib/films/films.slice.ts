import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { FilmEntity } from '@studio-ghibli-search-engine/models';
import {
  FilmResponse,
  responseRemap,
  searchService,
} from '@studio-ghibli-search-engine/services';

import { RootState } from '../root/root-state.interface';

export const FILMS_FEATURE_KEY = 'films';

export interface FilmsState extends EntityState<FilmEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string;
}

export const filmsAdapter = createEntityAdapter<FilmEntity>();

export const fetchFilms = createAsyncThunk<FilmEntity[]>(
  'films/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const filmsResponse: FilmResponse[] = await searchService.getFilms();
      return filmsResponse.map((response) =>
        responseRemap<FilmEntity>(response)
      );
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);

export const initialFilmsState: FilmsState = filmsAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: undefined,
});

export const filmsSlice = createSlice({
  name: FILMS_FEATURE_KEY,
  initialState: initialFilmsState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilms.pending, (state: FilmsState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchFilms.fulfilled,
        (state: FilmsState, action: PayloadAction<FilmEntity[]>) => {
          filmsAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchFilms.rejected, (state: FilmsState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const filmsReducer = filmsSlice.reducer;

export const filmsActions = { fetchFilms, ...filmsSlice.actions };


const { selectAll, selectEntities } = filmsAdapter.getSelectors();

export const getFilmsState = (rootState: RootState): FilmsState =>
  rootState[FILMS_FEATURE_KEY];

export const selectAllFilms = createSelector(getFilmsState, selectAll);

export const selectFilmsEntities = createSelector(
  getFilmsState,
  selectEntities
);

export const shouldFetchFilms = createSelector(getFilmsState, (state): boolean => state.loadingStatus === 'not loaded' || state.loadingStatus === 'error');

export const filmsSelectors = {selectAllFilms, shouldFetchFilms};