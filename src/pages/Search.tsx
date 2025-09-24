import React from "react";
import styles from "./styles/Search.module.css";
import SearchForm from "../components/SearchForm/SearchForm";
import SearchRightImage from "../assets/images/searchPageRight.png";
import Document from "../assets/images/document.png";
import Folders from "../assets/images/folders.png";
import clsx from "clsx";

const Search: React.FC = () => {
  return (
    <div className={styles.search}>
      <div className={styles.searchTop}>
        <div className={styles.searchTopTitleBlock}>
          <h1 className={styles.searchTitle}>
            Найдите необходимые данные в пару кликов.
          </h1>
          <p className={styles.searchText}>
            Задайте параметры поиска.Чем больше заполните, тем точнее поиск
          </p>
        </div>

        <img
          className={clsx(styles.searchTopImage, styles.searchTopImageDocument)}
          src={Document}
          alt="документ"
        />
        <img
          className={clsx(styles.searchTopImage, styles.searchTopImageFolders)}
          src={Folders}
          alt="папки"
        />
      </div>
      <div className={styles.searchBottom}>
        <div className={styles.searchBottomLeft}>
          <SearchForm />
        </div>
        <div className={styles.searchBottomRight}>
          <img src={SearchRightImage} alt="форма поиска" />
        </div>
      </div>
    </div>
  );
};

export default Search;
