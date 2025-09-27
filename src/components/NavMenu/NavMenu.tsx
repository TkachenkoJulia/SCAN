import { Link } from "react-router-dom";
import styles from "./NavMenu.module.css";

const NavMenu: React.FC = () => {
  return (
    <nav className={styles.navMenu}>
      <Link className={styles.navMenuLink} to="/">
        Главная
      </Link>
      <Link className={styles.navMenuLink} to="/tariffs">
        Тарифы
      </Link>
      <Link className={styles.navMenuLink} to="/faq">
        FAQ
      </Link>
    </nav>
  );
};

export default NavMenu;
