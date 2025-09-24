import React from "react";
import styles from "./styles/Main.module.css";
import MainPageSlider from "../components/MainPageSlider/MainPageSlider";
import FirstScreenRight from "../assets/images/firstScreen_right.png";
import manLeft from "../assets/images/man-left.png";
import manRight from "../assets/images/man-right.png";
import clsx from "clsx";

import Lamp from "../assets/icons/lamp.svg";
import Darts from "../assets/icons/darts.svg";
import Laptop from "../assets/icons/laptop.svg";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Main: React.FC = () => {
  const isAuthorized = useSelector(
    (state: RootState) => state.auth.status === "authorized"
  );

  return (
    <>
      <section className={styles.firstScreen}>
        <div className={styles.firstScreenLeft}>
          <div className={styles.firstScreenLeftInfo}>
            <h1 className={styles.firstScreenTitle}>
              Сервис по поиску публикаций о компании по его ИНН
            </h1>
            <p className={styles.firstScreenLeftInfoText}>
              Комплексный анализ публикаций, получение данных в формате PDF на
              электронную почту.
            </p>
          </div>
          <Link to={"/search"} className={styles.firstScreenButton}>
            Запросить данные
          </Link>
        </div>
        <div className={styles.firstScreenRight}>
          <img
            src={FirstScreenRight}
            alt="сервис по поиску публикаций о компании по его ИНН"
          />
        </div>
      </section>
      <section className={styles.sliderScreen}>
        <h2 className={styles.screenTitle}>Почему именно мы</h2>
        <MainPageSlider />
      </section>
      <section className={styles.manScreen}>
        <img src={manLeft} alt="мужчина" />
        <img src={manRight} alt="облака" />
      </section>
      <section className={styles.tarifScreen}>
        <h2 className={styles.screenTitle}>Наши тарифы</h2>
        <div className={styles.tarifScreenContainer}>
          <div
            className={clsx(
              styles.tarifScreenItem,
              styles.tarifScreenItemBeginner
            )}
          >
            <div className={styles.tarifScreenItemHeading}>
              <div>
                <div className={styles.tarifScreenItemTitleContainer}>
                  <h3 className={styles.tarifScreenItemHeadingTitle}>
                    Базовый
                  </h3>
                </div>
                <p className={styles.tarifScreenItemHeadingText}>
                  Для небольшого исследования
                </p>
              </div>
              <img src={Lamp} alt="лампа" />
            </div>
            <div className={styles.tarifScreenItemBody}>
              {isAuthorized && (
                <span className={styles.tarifScreenItemBadge}>
                  Текущий тариф
                </span>
              )}
              <div className={styles.tarifScreenItemPrice}>
                <div>
                  <p className={styles.tarifScreenItemPriceText}>799 ₽</p>
                  <p
                    className={clsx(
                      styles.tarifScreenItemPriceText,
                      styles.tarifScreenItemPriceTextDeleted
                    )}
                  >
                    1 200 ₽
                  </p>
                </div>
                <p className={styles.tarifScreenItemPriceInfoText}>
                  или 150 ₽/мес. при рассрочке на 24 мес.
                </p>
              </div>
              <div className={styles.tarifScreenItemInfo}>
                <p className={styles.tarifScreenItemInfoText}>
                  В тариф входит:
                </p>
                <ul>
                  <li>Безлимитная история запросов</li>
                  <li>Безопасная сделка</li>
                  <li>Поддержка 24/7</li>
                </ul>
              </div>
              {isAuthorized ? (
                <button
                  className={clsx(
                    styles.tarifScreenItemButton,
                    styles.tarifScreenItemButtonGray
                  )}
                >
                  Перейти в личный кабинет
                </button>
              ) : (
                <button
                  className={clsx(
                    styles.tarifScreenItemButton,
                    styles.tarifScreenItemButtonBlue
                  )}
                >
                  Подробнее
                </button>
              )}
            </div>
          </div>
          <div
            className={clsx(styles.tarifScreenItem, styles.tarifScreenItemPro)}
          >
            <div className={styles.tarifScreenItemHeading}>
              <div>
                <h3 className={styles.tarifScreenItemHeadingTitle}>Pro</h3>
                <p className={styles.tarifScreenItemHeadingText}>
                  Для HR и фрилансеров
                </p>
              </div>
              <img src={Darts} alt="дартс" />
            </div>
            <div className={styles.tarifScreenItemBody}>
              <div className={styles.tarifScreenItemPrice}>
                <div>
                  <p className={styles.tarifScreenItemPriceText}>1 299 ₽</p>
                  <p
                    className={clsx(
                      styles.tarifScreenItemPriceText,
                      styles.tarifScreenItemPriceTextDeleted
                    )}
                  >
                    2 600 ₽
                  </p>
                </div>
                <p className={styles.tarifScreenItemPriceInfoText}>
                  или 279 ₽/мес. при рассрочке на 24 мес.
                </p>
              </div>
              <div className={styles.tarifScreenItemInfo}>
                <p className={styles.tarifScreenItemInfoText}>
                  В тариф входит:
                </p>
                <ul>
                  <li>Все пункты тарифа Beginner</li>
                  <li>Экспорт истории</li>
                  <li>Рекомендации по приоритетам</li>
                </ul>
              </div>
              <button
                className={clsx(
                  styles.tarifScreenItemButton,
                  styles.tarifScreenItemButtonBlue
                )}
              >
                Подробнее
              </button>
            </div>
          </div>
          <div
            className={clsx(
              styles.tarifScreenItem,
              styles.tarifScreenItemBusiness
            )}
          >
            <div className={styles.tarifScreenItemHeading}>
              <div>
                <h3 className={styles.tarifScreenItemHeadingTitle}>Business</h3>
                <p className={styles.tarifScreenItemHeadingText}>
                  Для корпоративных клиентов
                </p>
              </div>
              <img src={Laptop} alt="ноутбук" />
            </div>
            <div className={styles.tarifScreenItemBody}>
              <div className={styles.tarifScreenItemPrice}>
                <div>
                  <p className={styles.tarifScreenItemPriceText}>2 379 ₽</p>
                  <p
                    className={clsx(
                      styles.tarifScreenItemPriceText,
                      styles.tarifScreenItemPriceTextDeleted
                    )}
                  >
                    3 700 ₽
                  </p>
                </div>
              </div>
              <div className={styles.tarifScreenItemInfo}>
                <p className={styles.tarifScreenItemInfoText}>
                  В тариф входит:
                </p>
                <ul>
                  <li>Все пункты тарифа Pro</li>
                  <li>Безлимитное количество запросов</li>
                  <li>Приоритетная поддержка</li>
                </ul>
              </div>
              <button
                className={clsx(
                  styles.tarifScreenItemButton,
                  styles.tarifScreenItemButtonBlue
                )}
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Main;
