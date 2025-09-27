import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import NavMenu from "../NavMenu/NavMenu";
import HeaderAuth from "../HeaderAuth/HeaderAuth";
import styles from "./Header.module.css";
import Logo from "../Logo/Logo";

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(document.documentElement.clientWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {!isMobile && <Logo isMobile={false} isMenuOpen={false} />}
        {!isMobile && (
          <>
            <NavMenu />
          </>
        )}
        {auth.status === "authorized" ? (
          <HeaderAuth status="authorized" isMobile={isMobile} />
        ) : (
          <HeaderAuth status="unauthorized" isMobile={isMobile} />
        )}
      </div>
    </header>
  );
};

export default Header;
