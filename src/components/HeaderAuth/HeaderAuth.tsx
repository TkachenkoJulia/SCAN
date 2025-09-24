import { Link } from "react-router";
import styles from "./HeaderAuth.module.css";
import clsx from "clsx";
import { useState } from "react";
import NavMenu from "../NavMenu/NavMenu";
import Logo from "../Logo/Logo";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";

import Avatar from "../../assets/images/avatar.png";

type HeaderAuthProps = {
  status: string;
  isMobile: boolean;
};
const HeaderAuth: React.FC<HeaderAuthProps> = ({ status, isMobile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { usedCompanyCount, companyLimit, userLogin } = useAppSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.headerAuth}>
      {!isMobile && (
        <>
          {status === "unauthorized" ? (
            <div className={styles.headerAuthUnauthorized}>
              <Link className={styles.headerAuthRegisterLink} to="/register">
                Зарегистрироваться
              </Link>
              <span className={styles.headerAuthSeparator}></span>
              <Link className={styles.headerAuthLoginButton} to="/login">
                Войти
              </Link>
            </div>
          ) : (
            <div className={styles.headerAuthAuthorized}>
              <div className={styles.headerAuthInfo}>
                <p>
                  Использовано компаний{" "}
                  <span
                    className={clsx(styles.headerAuthInfoSpan)}
                    id="usedCompanies"
                  >
                    {usedCompanyCount ?? "-"}
                  </span>
                </p>
                <p>
                  Лимит по компаниям{" "}
                  <span
                    id="limitCompanies"
                    className={clsx(
                      styles.headerAuthInfoSpan,
                      styles.headerAuthInfoSpanGreen
                    )}
                  >
                    {companyLimit ?? "-"}
                  </span>
                </p>
              </div>
              <div className={styles.headerAuthProfile}>
                <div className={styles.headerAuthProfileInfo}>
                  <p id="userName">{userLogin ?? ""}</p>
                  <button
                    className={styles.headerAuthProfileLogout}
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
                <img
                  className={styles.headerAuthProfileImage}
                  src={Avatar}
                  alt={userLogin ?? ""}
                />
              </div>
            </div>
          )}
        </>
      )}
      {isMobile && (
        <>
          <div className={styles.authHeaderContainer}>
            <Logo isMobile={true} isMenuOpen={isMenuOpen} />
            <div className={styles.headerAuthInfo}>
              <p>
                Использовано компаний{" "}
                <span
                  className={clsx(styles.headerAuthInfoSpan)}
                  id="usedCompanies"
                >
                  {usedCompanyCount ?? "-"}
                </span>
              </p>
              <p>
                Лимит по компаниям{" "}
                <span
                  id="limitCompanies"
                  className={clsx(
                    styles.headerAuthInfoSpan,
                    styles.headerAuthInfoSpanGreen
                  )}
                >
                  {companyLimit ?? "-"}
                </span>
              </p>
            </div>
            <button
              className={clsx(styles.burgerMenu, isMenuOpen && styles.active)}
              onClick={toggleMenu}
              aria-label="Открыть меню авторизации"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          {/* Мобильное меню */}
          <div
            className={clsx(styles.menuOverlay, isMenuOpen && styles.active)}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className={styles.mobileMenu}>
              <NavMenu />
              <Link
                to="/register"
                className={clsx(styles.mobileLink, styles.registerLink)}
                onClick={() => setIsMenuOpen(false)}
              >
                Зарегистрироваться
              </Link>

              <Link
                to="/login"
                className={clsx(styles.mobileLink, styles.loginButton)}
                onClick={() => setIsMenuOpen(false)}
              >
                Войти
              </Link>
              <button
                className={clsx(styles.mobileLink, styles.logoutButton)}
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderAuth;
