import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./MainPageSlider.module.css";

import iconClock from "../../assets/images/icon-clock.png";
import iconSearch from "../../assets/images/icon-search.png";
import iconProtect from "../../assets/images/icon-protect.png";
import chevronLeft from "../../assets/icons/chevron-left.svg";
import chevronRight from "../../assets/icons/chevron-right.svg";

const MainPageSlider: React.FC = () => {
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

  return (
    <div className={styles.mainPageSlider}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={3}
        navigation={{
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
        }}
        pagination={{
          clickable: true,
          el: `.${styles.swiperPagination}`,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className={styles.swiperContainer}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.swiperSlide}>
            <div className={styles.mainPageSliderItem}>
              <img src={slide.icon} alt={slide.alt} />
              <p>{slide.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Кастомные кнопки навигации */}
      <div className={styles.swiperButtonPrev}>
        <img src={chevronLeft} alt="стрелка влево" />
      </div>
      <div className={styles.swiperButtonNext}>
        <img src={chevronRight} alt="стрелка вправо" />
      </div>

      {/* Кастомная пагинация */}
      <div className={styles.swiperPagination}></div>
    </div>
  );
};

export default MainPageSlider;
