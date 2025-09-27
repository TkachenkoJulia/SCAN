import React from "react";
import styles from "./styles/SearchResults.module.css";
import SearchResultsData from "../components/SearchResultsData/SearchResultsData";
import SearchResultsList from "../components/SearchList/SearchList";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SearchResultsWoman from "../assets/images/searchResults.png";

const PAGE_SIZE = 10;

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

type HistogramDataType = {
  date: "string";
  value: "number";
};

type HistogramType = {
  histogramType: string;
  data: HistogramDataType[];
};

const SearchResults: React.FC = () => {
  const [histograms, setHistograms] = useState<HistogramType[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [docs, setDocs] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation() as {
    state?: { params?: any; histograms?: HistogramType[] };
  };
  const [params, setParams] = useState<any>(null);

  useEffect(() => {
    const stateParams = location?.state?.params;
    const stateHist = location?.state?.histograms;
    if (stateParams) {
      setParams(stateParams);
    } else {
      try {
        const ls = localStorage.getItem("searchParams");
        setParams(ls ? JSON.parse(ls) : null);
      } catch {
        setParams(null);
      }
    }
    if (stateHist && Array.isArray(stateHist)) {
      setHistograms(stateHist);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!location?.state?.histograms) {
      setHistograms([]);
    }
    setIds([]);
    setDocs([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    if (!params) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const idsResp = await fetch(
          "https://gateway.scan-interfax.ru/api/v1/objectsearch",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(params),
          }
        );
        const idsData = await idsResp.json();
        const loadedIds =
          idsData.items?.map((item: any) => item.encodedId) || [];
        setIds(loadedIds);

        if (loadedIds.length > 0) {
          const firstIds = loadedIds.slice(0, PAGE_SIZE);
          const docsResp = await fetch(
            "https://gateway.scan-interfax.ru/api/v1/documents",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ ids: firstIds }),
            }
          );
          const docsData = await docsResp.json();
          const docsOk = (docsData || [])
            .filter((d: any) => d.ok)
            .map((d: any) => d.ok);
          setDocs(docsOk);
          setPage(1);
          setHasMore(loadedIds.length > PAGE_SIZE);
        } else {
          setDocs([]);
          setHasMore(false);
        }
      } catch (e) {
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line
  }, [params]);

  const onShowMore = async () => {
    if (!ids.length || loading) return;
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const nextIds = ids.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
      const docsResp = await fetch(
        "https://gateway.scan-interfax.ru/api/v1/documents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ ids: nextIds }),
        }
      );
      const docsData = await docsResp.json();
      const docsOk = (docsData || [])
        .filter((d: any) => d.ok)
        .map((d: any) => d.ok);
      setDocs((prev) => [...prev, ...docsOk]);
      setPage((prev) => prev + 1);
      setHasMore(ids.length > (page + 1) * PAGE_SIZE);
    } catch (e) {
      setError("Ошибка загрузки публикаций");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.SearchResults}>
      <div className={styles.SearchResultsTop}>
        <div className={styles.SearchResultsTopLeft}>
          <h1 className={styles.SearchResultsTitle}>
            Ищем. Скоро будут результаты
          </h1>
          <p className={styles.SearchResultsSubtitle}>
            Поиск может занять некоторое время, просим сохранять терпение.
          </p>
        </div>
        <div className={styles.SearchResultsTopRight}>
          <img src={SearchResultsWoman} alt="результаты поиска" />
        </div>
      </div>
      <div className={styles.SearchResultsBottom}>
        <div className={styles.SearchResultsBottomTitle}>
          <h2>Общая сводка</h2>
          <p>Найдено {histograms[0]?.data?.length} вариантов</p>
        </div>
        <div className={styles.SearchResultsBottomData}>
          <SearchResultsData histograms={histograms} />
          <SearchResultsList
            docs={docs}
            hasMore={hasMore}
            loading={loading}
            onShowMore={onShowMore}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
