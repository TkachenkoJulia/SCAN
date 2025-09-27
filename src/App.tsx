import React from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import withLayout from "./hoc/Layout/Layout";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import SearchResults from "./pages/SearchResults";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFromStorage } from "./store/authSlice";
import { AppDispatch } from "./store";
import { useAppSelector } from "./store/hooks";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") ?? undefined;
    const expire = localStorage.getItem("expire") ?? undefined;
    const userLogin = localStorage.getItem("userLogin") ?? undefined;

    const accountInfoStr = localStorage.getItem("accountInfo");
    const accountInfo = accountInfoStr ? JSON.parse(accountInfoStr) : undefined;
    if (accessToken && expire) {
      dispatch(
        setFromStorage({
          accessToken,
          expire,
          userLogin,
          accountInfo,
        })
      );
    }
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route index element={<Main />} />
        <Route path="login" element={<Auth action="login" />} />
        <Route path="register" element={<Auth action="register" />} />
        <Route
          path="search"
          element={
            auth.status === "authorized" ? (
              <Search />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="results"
          element={
            auth.status === "authorized" ? (
              <SearchResults />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default withLayout(App);
