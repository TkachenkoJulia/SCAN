import React from "react";
import styles from "./Footer.module.css"
import { Link } from "react-router";

import LogoFooter from '../../assets/images/logo-footer.png'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <Link to="/"  className={styles.footerLogo} >
          <img src={LogoFooter} alt="скан" />
        </Link>
        <div className={styles.footerRight}>
          <ul className={styles.footerMenu}>
            <li className={styles.footerMenuItem}>
              <a className={styles.footerMenuLink} href="">г. Москва, Цветной б-р, 40</a>
            </li>
            <li className={styles.footerMenuItem}>
              <a className={styles.footerMenuLink} href="tel:+74957712111">+7 495 771 21 11</a>
            </li>
            <li className={styles.footerMenuItem}>
              <a className={styles.footerMenuLink} href="mailto:info@skan.ru">info@skan.ru</a>
            </li>
          </ul>
          <p className={styles.footerMenuCopyright}>© 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
