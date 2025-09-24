import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  expire: string | null;
  accountInfo: any | null;
  status: "idle" | "loading" | "authorized" | "unauthorized" | "error";
  error: string | null;
  usedCompanyCount?: number;
  companyLimit?: number;
  userLogin?: string;
}

interface SetFromStoragePayload {
  accessToken: string | null;
  expire: string | null;
  accountInfo: any | null;
  usedCompanyCount?: number;
  companyLimit?: number;
  userLogin?: string;
}

const initialState: AuthState = {
  accessToken: null,
  expire: null,
  accountInfo: null,
  status: "idle",
  error: null,
  usedCompanyCount: undefined,
  companyLimit: undefined,
  userLogin: undefined,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { login, password }: { login: string; password: string },
    thunkAPI
  ) => {
    const res = await fetch(
      "https://gateway.scan-interfax.ru/api/v1/account/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      }
    );
    if (!res.ok) throw new Error("Ошибка авторизации");
    const data = await res.json();
    if (!data.accessToken || !data.expire)
      throw new Error("Неверный ответ сервера");

    const infoRes = await fetch(
      "https://gateway.scan-interfax.ru/api/v1/account/info",
      {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      }
    );
    const accountInfo = infoRes.ok ? await infoRes.json() : null;

    return { ...data, accountInfo };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.expire = null;
      state.accountInfo = null;
      state.status = "unauthorized";
      state.error = null;
      state.usedCompanyCount = undefined;
      state.companyLimit = undefined;
      state.userLogin = undefined;
      localStorage.clear();
    },
    setFromStorage(state, action: { payload: SetFromStoragePayload }) {
      state.accessToken = action.payload.accessToken;
      state.expire = action.payload.expire;
      state.accountInfo = action.payload.accountInfo;
      state.status = action.payload.accessToken ? "authorized" : "unauthorized";

      if (action.payload.accountInfo) {
        state.usedCompanyCount = action.payload.accountInfo.usedCompanyCount;
        state.companyLimit = action.payload.accountInfo.companyLimit;
        state.userLogin = action.payload.accountInfo.userLogin;
      } else {
        state.usedCompanyCount = action.payload.usedCompanyCount;
        state.companyLimit = action.payload.companyLimit;
        state.userLogin = action.payload.userLogin;
      }
    },
    setProfileInfo(state, action) {
      state.usedCompanyCount = action.payload.usedCompanyCount;
      state.companyLimit = action.payload.companyLimit;
    },
    setUserLogin(state, action) {
      state.userLogin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.expire = action.payload.expire;
        state.accountInfo = action.payload.accountInfo;
        state.status = "authorized";
        state.error = null;

        if (action.payload.accountInfo) {
          state.usedCompanyCount = action.payload.accountInfo.usedCompanyCount;
          state.companyLimit = action.payload.accountInfo.companyLimit;
          state.userLogin = action.payload.accountInfo.userLogin;
        }

        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("expire", action.payload.expire);
        localStorage.setItem(
          "accountInfo",
          JSON.stringify(action.payload.accountInfo)
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Ошибка авторизации";
      });
  },
});

export const { logout, setFromStorage, setProfileInfo, setUserLogin } =
  authSlice.actions;
export default authSlice.reducer;
