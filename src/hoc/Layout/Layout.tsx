import React from "react";
import global from "../../global.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Layout.module.css";

// HOC: принимает компонент и возвращает обёрнутый
function withLayout<P>(
  WrappedComponent: React.ComponentType<P>
): React.FC<React.PropsWithChildren<P>> {
  return (props: React.PropsWithChildren<P>) => (
    <div className={styles.appLayout}>
      <Header />
      <main className={styles.mainContent}>
        <div className={global.container}>
          <WrappedComponent {...props} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default withLayout;
