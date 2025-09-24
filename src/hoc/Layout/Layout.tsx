import React from "react";
import styles from "./Layout.module.css";
import global from '../../global.module.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

// HOC: принимает компонент и возвращает обёрнутый
function withLayout<P>(WrappedComponent: React.ComponentType<P>): React.FC<React.PropsWithChildren<P>> {
  return (props: React.PropsWithChildren<P>) => (
    <div>
      <Header />
      <div className={global.container}>
        <WrappedComponent {...props} />
      </div>
      <Footer />
    </div>
  );
}

export default withLayout;
