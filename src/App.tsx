import React from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router";
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
    const accessToken = localStorage.getItem("accessToken");
    const expire = localStorage.getItem("expire");
    const accountInfo = JSON.parse(
      localStorage.getItem("accountInfo") || "null"
    );
    if (accessToken && expire) {
      dispatch(
        setFromStorage({
          accessToken,
          expire,
          accountInfo,
          usedCompanyCount: accountInfo?.usedCompanyCount,
          companyLimit: accountInfo?.companyLimit,
          userLogin: accountInfo?.userLogin,
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
