import React from "react";
import styles from "./SearchList.module.css";

import PublicationCard from "./PublicationCard";

type DocType = {
  id: string;
  issueDate: string;
  source: { name: string };
  title: { text: string };
  content: { markup: string };
  url: string;
  attributes: {
    isTechNews: boolean;
    isAnnouncement: boolean;
    isDigest: boolean;
    wordCount: number;
  };
};

interface SearchListProps {
  docs: DocType[];
  hasMore: boolean;
  loading: boolean;
  onShowMore: () => void;
}

const SearchList: React.FC<SearchListProps> = ({
  docs,
  hasMore,
  loading,
  onShowMore,
}) => {
  if (loading && docs.length === 0) {
    return <div className={styles.SearchList}>Загрузка публикаций...</div>;
  }

  if (!loading && docs.length === 0) {
    return <div className={styles.SearchList}>Нет публикаций</div>;
  }
  return (
    <div className={styles.SearchList}>
      <div className={styles.SearchListCards}>
        {docs.map((doc: DocType, idx: number) => (
          <PublicationCard key={doc.id || idx} doc={doc} />
        ))}
      </div>
      {hasMore && !loading && (
        <button className={styles.showMoreBtn} onClick={onShowMore}>
          Показать больше
        </button>
      )}
      {loading && docs.length > 0 && (
        <div className={styles.loader}>Загрузка...</div>
      )}
    </div>
  );
};

export default SearchList;
