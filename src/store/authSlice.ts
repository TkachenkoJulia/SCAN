import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

type AuthStatus = "unauthorized" | "authorized" | "loading" | "error";
interface AuthState {
  accessToken?: string;
  expire?: string;
  status: AuthStatus;
  accountInfo?: {
    eventFiltersInfo?: {
      usedCompanyCount?: number;
      companyLimit?: number;
    };
  };
  userLogin: string | null;
  usedCompanyCount: number | null;
  companyLimit: number | null;
}
interface SetFromStoragePayload {
  accessToken?: string;
  expire?: string;
  userLogin?: string;
  accountInfo?: {
    eventFiltersInfo?: {
      usedCompanyCount?: number;
      companyLimit?: number;
    };
  };
}

const initialState: AuthState = {
  accessToken: undefined,
  expire: undefined,
  status: "unauthorized",
  accountInfo: undefined,
  userLogin: null,
  usedCompanyCount: null,
  companyLimit: null,
};

export const login = createAsyncThunk<
  { accessToken: string; expire: string }, // payload on success
  { login: string; password: string }, // args
  { rejectValue: string }
>("auth/login", async (body, { rejectWithValue }) => {
  const res = await fetch(
    "https://gateway.scan-interfax.ru/api/v1/account/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    return rejectWithValue(text || "Auth failed");
  }
  const data = await res.json();
  // синхронизируем localStorage
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("expire", data.expire);
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setFromStorage(state, { payload }: { payload: SetFromStoragePayload }) {
      state.accessToken = payload.accessToken ?? undefined;
      state.expire = payload.expire ?? undefined;
      state.status = payload.accessToken ? "authorized" : "unauthorized";
      state.accountInfo = payload.accountInfo;

      state.userLogin = payload.userLogin ?? state.userLogin ?? null;

      const efi = payload.accountInfo?.eventFiltersInfo;
      state.usedCompanyCount =
        efi?.usedCompanyCount ?? state.usedCompanyCount ?? null;
      state.companyLimit = efi?.companyLimit ?? state.companyLimit ?? null;
    },

    setStatus(state, { payload }: PayloadAction<AuthStatus>) {
      state.status = payload;
    },

    setUserLogin(state, { payload }: PayloadAction<string | undefined>) {
      state.userLogin = payload ?? null;
      if (payload) localStorage.setItem("userLogin", payload);
      else localStorage.removeItem("userLogin");
    },

    setProfileInfo(
      state,
      {
        payload,
      }: PayloadAction<{ usedCompanyCount?: number; companyLimit?: number }>
    ) {
      const { usedCompanyCount, companyLimit } = payload;
      state.usedCompanyCount = usedCompanyCount ?? state.usedCompanyCount;
      state.companyLimit = companyLimit ?? state.companyLimit;

      // синхронизируем accountInfo в localStorage, если ты его там хранишь
      const ai = state.accountInfo ?? {};
      const next = {
        ...ai,
        eventFiltersInfo: {
          ...(ai.eventFiltersInfo ?? {}),
          usedCompanyCount: state.usedCompanyCount ?? undefined,
          companyLimit: state.companyLimit ?? undefined,
        },
      };
      state.accountInfo = next;
      localStorage.setItem("accountInfo", JSON.stringify(next));
    },

    logout(state) {
      state.accessToken = undefined;
      state.expire = undefined;
      state.status = "unauthorized";
      state.accountInfo = undefined;
      state.userLogin = null;
      state.usedCompanyCount = null;
      state.companyLimit = null;
      ["accessToken", "expire", "accountInfo", "userLogin"].forEach((k) =>
        localStorage.removeItem(k)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = "authorized";
        state.accessToken = payload.accessToken;
        state.expire = payload.expire;
      })
      .addCase(login.rejected, (state) => {
        state.status = "error"; // или "unauthorized"
        state.accessToken = undefined;
        state.expire = undefined;
      });
  },
});

export const {
  setFromStorage,
  setStatus,
  setUserLogin,
  setProfileInfo,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
