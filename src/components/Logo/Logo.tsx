import { Link } from "react-router";
import LogoImage from "../../assets/images/logo.png";
import LogoFooterImage from "../../assets/images/logo-footer.png";
import styles from "./Logo.module.css";

interface LogoProps {
  isMobile: boolean;
  isMenuOpen: boolean;
}
const Logo: React.FC<LogoProps> = ({ isMobile, isMenuOpen }) => {
  return (
    <Link className={styles.headerLogo} to="/">
      {!isMobile ? (
        <img
          src={LogoImage}
          style={isMenuOpen ? { display: "none" } : {}}
          alt="лого"
        />
      ) : null}
      {isMobile && !isMenuOpen ? <img src={LogoImage} alt="лого" /> : null}
      {isMobile && isMenuOpen ? <img src={LogoFooterImage} alt="лого" /> : null}
    </Link>
  );
};

export default Logo;
