import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchParams {
  [key: string]: any;
}

export interface HistogramPoint {
  date: string;
  value: number;
}

export interface Doc {
  id: string;
  issueDate: string;
  source: { name: string };
  title: { text: string };
  content: { markup: string };
  url: string;
  attributes: {
    isTechNews: boolean;
    isAnnouncement: boolean;
    isDigest: boolean;
    wordCount: number;
  };
}

export interface Histogram {
  histogramType: string;
  data: HistogramPoint[];
}

export interface SearchState {
  params: SearchParams | null;
  histograms: Histogram[];
  ids: string[];
  docs: Doc[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadedCount: number;
}

const initialState: SearchState = {
  params: null,
  histograms: [],
  ids: [],
  docs: [],
  loading: false,
  error: null,
  hasMore: true,
  loadedCount: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setParams(state, action: PayloadAction<SearchParams>) {
      state.params = action.payload;
    },
    setHistograms(state, action: PayloadAction<Histogram[]>) {
      state.histograms = action.payload;
    },
    setIds(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
      state.loadedCount = 0;
      state.hasMore = action.payload.length > 0;
    },
    addDocs(state, action: PayloadAction<Doc[]>) {
      state.docs = [...state.docs, ...action.payload];
      state.loadedCount += action.payload.length;
      state.hasMore = state.loadedCount < state.ids.length;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetSearch(state) {
      state.params = null;
      state.histograms = [];
      state.ids = [];
      state.docs = [];
      state.loading = false;
      state.error = null;
      state.hasMore = true;
      state.loadedCount = 0;
    },
  },
});

export const {
  setParams,
  setHistograms,
  setIds,
  addDocs,
  setLoading,
  setError,
  resetSearch,
} = searchSlice.actions;
export default searchSlice.reducer;
