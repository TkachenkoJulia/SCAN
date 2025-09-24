import React from "react";
import Characters from "../assets/images/characters.png";
import styles from "./styles/Auth.module.css";
import AuthForm from "../components/AuthForm/AuthForm";

interface AuthProps {
  action: string;
}

const Auth: React.FC<AuthProps> = ({ action }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authMainContainer}>
        <div className={styles.authLeft}>
          <h1 className={styles.authTitle}>
            Для оформления подписки на тариф нужно авторизоваться
          </h1>
          <img src={Characters} alt="авторизация" />
        </div>
        <div className={styles.authRight}>
          <AuthForm action={action} />
        </div>
        <div className={styles.authMobile}>
          <img src={Characters} alt="авторизация" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
