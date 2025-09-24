import React, { useRef, useState } from "react";
import styles from "./SearchResultsData.module.css";
interface SearchResultsDataProps {
  histograms: any[];
}

const SearchResultsData: React.FC<SearchResultsDataProps> = ({
  histograms,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const periods = histograms[0]?.data?.map((point: any) => point.date) || [];
  const totalDocs =
    histograms.find((h) => h.histogramType === "totalDocuments")?.data || [];
  const risks =
    histograms.find((h) => h.histogramType === "riskFactors")?.data || [];

  if (periods.length === 0) {
    return <div className={styles.noData}>Нет данных для отображения</div>;
  }

  // Навигация для мобильной версии
  const scrollMobile = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "right" && currentIndex < periods.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Навигация для десктопной версии
  const scrollDesktop = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 180; // ширина одного блока
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const currentPeriod = periods[currentIndex];
  const currentTotal = totalDocs[currentIndex]?.value || 0;
  const currentRisks = risks[currentIndex]?.value || 0;

  return (
    <div className={styles.SearchResultsDataCustom}>
      {/* Десктопная версия */}
      <div className={styles.desktopVersion}>
        <div className={styles.carouselButtons}>
          <button
            className={styles.carouselBtn}
            onClick={() => scrollDesktop("left")}
          >
            &lt;
          </button>
          <button
            className={styles.carouselBtn}
            onClick={() => scrollDesktop("right")}
          >
            &gt;
          </button>
        </div>
        <div className={styles.sliderContainer}>
          <div className={styles.stickyColWrapper}>
            <div className={styles.stickyCol}>
              <div className={styles.stickyCell}>Период</div>
              <div className={styles.stickyCell}>Всего</div>
              <div className={styles.stickyCell}>Риски</div>
            </div>
          </div>
          <div className={styles.carouselWrapper}>
            <div className={styles.scrollArea} ref={scrollRef}>
              <div className={styles.dataRowHeader}>
                {periods.map((date: string, idx: number) => (
                  <div className={styles.dataCellHeader} key={idx}>
                    {new Date(date).toLocaleDateString()}
                  </div>
                ))}
              </div>
              <div className={styles.dataRow}>
                {totalDocs.map((item: any, idx: number) => (
                  <div className={styles.dataCell} key={idx}>
                    {item.value}
                  </div>
                ))}
              </div>
              <div className={styles.dataRow}>
                {risks.map((item: any, idx: number) => (
                  <div className={styles.dataCell} key={idx}>
                    {item.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mobileVersion}>
        <div className={styles.mobileCard}>
          <div className={styles.mobileHeader}>
            <div className={styles.mobileHeaderCell}>Период</div>
            <div className={styles.mobileHeaderCell}>Всего</div>
            <div className={styles.mobileHeaderCell}>Риски</div>
          </div>
          <div className={styles.mobileData}>
            <div className={styles.mobileDataCell}>
              {new Date(currentPeriod).toLocaleDateString()}
            </div>
            <div className={styles.mobileDataCell}>{currentTotal}</div>
            <div className={styles.mobileDataCell}>{currentRisks}</div>
          </div>
        </div>
        <div className={styles.mobileNavigation}>
          <button
            className={`${styles.mobileNavBtn} ${
              currentIndex === 0 ? styles.disabled : ""
            }`}
            onClick={() => scrollMobile("left")}
            disabled={currentIndex === 0}
          >
            &lt;
          </button>
          <button
            className={`${styles.mobileNavBtn} ${
              currentIndex === periods.length - 1 ? styles.disabled : ""
            }`}
            onClick={() => scrollMobile("right")}
            disabled={currentIndex === periods.length - 1}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsData;
