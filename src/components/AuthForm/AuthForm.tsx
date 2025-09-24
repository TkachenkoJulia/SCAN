import React, { useState } from "react";
import lockImg from "../../assets/images/lock.png";
import styles from "./AuthForm.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  login as loginThunk,
  setProfileInfo,
  setUserLogin,
} from "../../store/authSlice";
import { useNavigate } from "react-router";
import Google from "../../assets/images/google.png";
import Facebook from "../../assets/images/facebook.png";
import Yandex from "../../assets/images/yandex.png";

interface AuthFormProps {
  action: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ action }) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const isFormValid =
    loginValue.trim() && password.trim() && !loginError && !passwordError;

  const navigate = useNavigate();

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+7\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/;
    return phoneRegex.test(phone);
  };

  const validateLogin = (login: string): string => {
    if (!login.trim()) return "";

    if (login.startsWith("+7")) {
      if (!validatePhone(login)) {
        return "Введите корректные данные";
      }
    }

    return "";
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLoginValue(value);
    setLoginError(validateLogin(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || auth.status === "loading") return;

    setLoginError("");
    setPasswordError("");

    try {
      const resultAction = await dispatch(
        loginThunk({ login: loginValue, password })
      );
      if (loginThunk.fulfilled.match(resultAction)) {
        const token = resultAction.payload.accessToken;
        const res = await fetch(
          "https://gateway.scan-interfax.ru/api/v1/account/info",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        let profileData = undefined;
        try {
          profileData = await res.json();
        } catch (jsonError) {
          const text = await res.text();
          console.error(text);
        }
        if (profileData && profileData.eventFiltersInfo) {
          dispatch(
            setProfileInfo({
              usedCompanyCount: profileData.eventFiltersInfo.usedCompanyCount,
              companyLimit: profileData.eventFiltersInfo.companyLimit,
            })
          );
        }

        dispatch(setUserLogin(loginValue));
      } else if (loginThunk.rejected.match(resultAction)) {
        const errorMessage =
          (resultAction.payload as string) ||
          resultAction.error.message ||
          "Ошибка авторизации";

        if (
          errorMessage.includes("пароль") ||
          errorMessage.includes("password")
        ) {
          setPasswordError("Неправильный пароль");
        } else if (
          errorMessage.includes("логин") ||
          errorMessage.includes("login") ||
          errorMessage.includes("пользователь")
        ) {
          setLoginError("Введите корректные данные");
        } else {
          setLoginError("Введите корректные данные");
        }
      }
    } catch (err) {
      setLoginError("Введите корректные данные");
    }
  };

  React.useEffect(() => {
    if (auth.status === "authorized") {
      navigate("/");
    }
  }, [auth.status, navigate]);

  return (
    <div className={styles.authRoot}>
      <img src={lockImg} alt="lock" className={styles.lockImg} />
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={tab === "login" ? styles.tabActive : styles.tab}
            onClick={() => setTab("login")}
          >
            Войти
          </button>
          <button
            type="button"
            className={tab === "register" ? styles.tabActive : styles.tab}
            onClick={() => setTab("register")}
          >
            Зарегистрироваться
          </button>
        </div>
        {tab === "login" && (
          <>
            <label className={styles.label}>Логин или номер телефона:</label>
            <input
              className={`${styles.input} ${
                loginError ? styles.inputError : ""
              }`}
              type="text"
              value={loginValue}
              onChange={handleLoginChange}
              autoComplete="username"
              placeholder="+7 912 653 21 42"
            />
            {loginError && (
              <div className={styles.fieldError}>{loginError}</div>
            )}

            <label className={styles.label}>Пароль:</label>
            <input
              className={`${styles.input} ${
                passwordError ? styles.inputError : ""
              }`}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              placeholder="***"
            />
            {passwordError && (
              <div className={styles.fieldError}>{passwordError}</div>
            )}

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={!isFormValid || auth.status === "loading"}
            >
              {auth.status === "loading" ? "Вход..." : "Войти"}
            </button>
            <div className={styles.restoreBox}>
              <button type="button" className={styles.restoreLink}>
                Восстановить пароль
              </button>
            </div>
            <div className={styles.socialBox}>
              <span className={styles.socialLabel}>Войти через:</span>
              <div className={styles.socialBtns}>
                <button type="button" className={styles.socialGoogle} disabled>
                  <img src={Google} alt="Google" />
                </button>
                <button
                  type="button"
                  className={styles.socialFacebook}
                  disabled
                >
                  <img src={Facebook} alt="Facebook" />
                </button>
                <button type="button" className={styles.socialYandex} disabled>
                  <img src={Yandex} alt="Yandex" />
                </button>
              </div>
            </div>
          </>
        )}
        {tab === "register" && (
          <div className={styles.registerStub}>
            Регистрация пока не реализована
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
