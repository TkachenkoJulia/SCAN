import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MainPageSlider.module.css";

import iconClock from "../../assets/images/icon-clock.png";
import iconSearch from "../../assets/images/icon-search.png";
import iconProtect from "../../assets/images/icon-protect.png";
import chevronLeft from "../../assets/icons/chevron-left.svg";
import chevronRight from "../../assets/icons/chevron-right.svg";

const slides = [
  {
    id: 1,
    icon: iconClock,
    alt: "Скорость обработки заявки",
    text: "Высокая и оперативная скорость обработки заявки",
  },
  {
    id: 2,
    icon: iconSearch,
    alt: "База данных",
    text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
  },
  {
    id: 3,
    icon: iconProtect,
    alt: "Защита конфиденциальности",
    text: "Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству",
  },
  {
    id: 4,
    icon: iconClock,
    alt: "Дополнительный слайд 1",
    text: "Дополнительная информация о наших возможностях",
  },
  {
    id: 5,
    icon: iconSearch,
    alt: "Дополнительный слайд 2",
    text: "Еще больше преимуществ для наших клиентов",
  },
  {
    id: 6,
    icon: iconProtect,
    alt: "Дополнительный слайд 3",
    text: "Продолжаем расширять функциональность",
  },
];

const getSlidesPerView = () =>
  window.matchMedia("(min-width: 1024px)").matches ? 3 : 1;

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

const MainPageSlider: React.FC = () => {
  const [spv, setSpv] = useState<number>(
    typeof window !== "undefined" ? getSlidesPerView() : 1
  );
  const [page, setPage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setSpv(getSlidesPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pages = useMemo(() => chunk(slides, spv), [spv]);
  const total = pages.length;

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, total - 1)));
  }, [total]);

  const goPrev = () => setPage((p) => (p - 1 + total) % total);
  const goNext = () => setPage((p) => (p + 1) % total);

  return (
    <div className={styles.mainPageSlider}>
      <div
        className={styles.swiperContainer}
        style={{
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: `${total * 100}%`,
            transform: `translateX(-${page * (100 / total)}%)`,
            transition: "transform 350ms ease",
          }}
        >
          {pages.map((items, idx) => (
            <div
              key={idx}
              style={{
                width: `${100 / total}%`,
                display: "flex",
                gap: 30,
                padding: "0 1px",
              }}
            >
              {items.map((slide) => (
                <div
                  key={slide.id}
                  className={styles.swiperSlide}
                  style={{
                    flex: `0 0 ${
                      spv === 1
                        ? "100%"
                        : `calc((100% - ${30 * (spv - 1)}px) / ${spv})`
                    }`,
                  }}
                >
                  <div className={styles.mainPageSliderItem}>
                    <img src={slide.icon} alt={slide.alt} />
                    <p>{slide.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        onClick={goPrev}
        className={styles.swiperButtonPrev}
        role="button"
        aria-label="Назад"
        tabIndex={0}
      >
        <img src={chevronLeft} alt="стрелка влево" />
      </div>
      <div
        onClick={goNext}
        className={styles.swiperButtonNext}
        role="button"
        aria-label="Вперед"
        tabIndex={0}
      >
        <img src={chevronRight} alt="стрелка вправо" />
      </div>
    </div>
  );
};

export default MainPageSlider;
