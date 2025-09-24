import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setParams, setHistograms } from "../../store/searchSlice";
import styles from "./SearchForm.module.css";
import { useNavigate } from "react-router";

const validateInn = (inn: string, error: { code: number; message: string }) => {
  var result = false;

  if (!inn.length) {
    error.code = 1;
    error.message = "ИНН пуст";
  } else if (/[^0-9]/.test(inn)) {
    error.code = 2;
    error.message = "ИНН может состоять только из цифр";
  } else if ([10, 12].indexOf(inn.length) === -1) {
    error.code = 3;
    error.message = "ИНН может состоять только из 10 или 12 цифр";
  } else {
    var checkDigit = function (inn: string, coefficients: number[]) {
      var n = 0;
      for (var i in coefficients) {
        n += coefficients[i] * parseInt(inn[i]);
      }
      return (n % 11) % 10;
    };
    switch (inn.length) {
      case 10:
        var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
        if (n10 === parseInt(inn[9])) {
          result = true;
        }
        break;
      case 12:
        var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        if (n11 === parseInt(inn[10]) && n12 === parseInt(inn[11])) {
          result = true;
        }
        break;
    }
    if (!result) {
      error.code = 4;
      error.message = "Неправильное контрольное число";
    }
  }
  return result;
};

const SearchForm: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [inn, setInn] = useState("");
  const [innError, setInnError] = useState("");
  const [docsAmount, setDocsAmount] = useState("");
  const [docsAmountError, setDocsAmountError] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [dateError, setDateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tone, setTone] = useState("any");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateDates = (start: string, end: string): string => {
    if (!start || !end) return "Пожалуйста, заполните обе даты";
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    if (s > now || e > now) return "Дата не может быть в будущем";
    if (s > e) return "Дата начала не может быть позже даты конца";
    return "";
  };

  const handleValidateInn = (value: string) => {
    let err = { code: 500, message: "" };
    const valid = validateInn(value, err);
    setInnError(valid ? "" : "Пожалуйста, введите корректный ИНН");
    return valid;
  };

  const handleValidateDocsAmount = (value: string) => {
    let num = parseInt(value, 10);
    if (!value || isNaN(num) || num < 1 || num > 1000) {
      setDocsAmountError("Введите число от 1 до 1000");
      return false;
    }
    setDocsAmountError("");
    return true;
  };

  const isFormValid =
    !innError &&
    !docsAmountError &&
    !dateError &&
    inn &&
    docsAmount &&
    dateStart &&
    dateEnd;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!handleValidateInn(inn)) valid = false;
    if (!handleValidateDocsAmount(docsAmount)) valid = false;
    const dateErr = validateDates(dateStart, dateEnd);
    setDateError(dateErr);
    if (dateErr) valid = false;
    if (!valid) return;
    setIsSubmitting(true);
    try {
      const maxFullness = (
        document.getElementById("maxFullness") as HTMLInputElement
      )?.checked;
      const isBusinessNews = (
        document.getElementById("isBusinessNews") as HTMLInputElement
      )?.checked;
      const onlyMainRole = (
        document.getElementById("onlyMainRole") as HTMLInputElement
      )?.checked;
      const onlyWithRiskFactors = (
        document.getElementById("onlyWithRiskFactors") as HTMLInputElement
      )?.checked;
      const excludeTechNews = (
        document.getElementById("excludeTechNews") as HTMLInputElement
      )?.checked;
      const excludeAnnouncements = (
        document.getElementById("excludeAnnouncements") as HTMLInputElement
      )?.checked;
      const excludeDigests = (
        document.getElementById("excludeDigests") as HTMLInputElement
      )?.checked;

      const pad = (n: number) => n.toString().padStart(2, "0");
      const formatDate = (d: string, start: boolean) => {
        if (!d) return "";
        const [year, month, day] = d.split("-");
        return `${year}-${month}-${day}T${
          start ? "00:00:00" : "23:59:59"
        }+03:00`;
      };
      const startDateStr = formatDate(dateStart, true);
      const endDateStr = formatDate(dateEnd, false);

      const requestBody = {
        issueDateInterval: {
          startDate: startDateStr,
          endDate: endDateStr,
        },
        searchContext: {
          targetSearchEntitiesContext: {
            targetSearchEntities: [
              {
                type: "company",
                sparkId: null,
                entityId: null,
                inn: inn ? Number(inn) : null,
                maxFullness: !!maxFullness,
                inBusinessNews: isBusinessNews ? true : null,
              },
            ],
            onlyMainRole: !!onlyMainRole,
            tonality: tone,
            onlyWithRiskFactors: !!onlyWithRiskFactors,
            riskFactors: {
              and: [],
              or: [],
              not: [],
            },
            themes: {
              and: [],
              or: [],
              not: [],
            },
          },
          themesFilter: {
            and: [],
            or: [],
            not: [],
          },
        },
        searchArea: {
          includedSources: [],
          excludedSources: [],
          includedSourceGroups: [],
          excludedSourceGroups: [],
        },
        attributeFilters: {
          excludeTechNews: !excludeTechNews,
          excludeAnnouncements: !excludeAnnouncements,
          excludeDigests: !excludeDigests,
        },
        similarMode: "duplicates",
        limit: docsAmount ? Number(docsAmount) : 1000,
        sortType: "sourceInfluence",
        sortDirectionType: "desc",
        intervalType: "month",
        histogramTypes: ["totalDocuments", "riskFactors"],
      };

      const toast = (await import("react-hot-toast")).toast;
      const response = await fetch(
        "https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      let data;
      try {
        data = await response.json();
      } catch (e) {
        toast.error("Ошибка при разборе ответа сервера");
        return;
      }
      if (!response.ok || (data && data.errorCode)) {
        toast.error(data?.message || "Ошибка при выполнении запроса");
        return;
      }
      dispatch(setParams(requestBody));
      dispatch(setHistograms(data.data));

      navigate("/results", {
        state: { params: requestBody, histograms: data.data },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={styles.searchFormLeft}>
        <div className={styles.searchFormGroup}>
          <label htmlFor="inn">ИНН Компании *</label>
          <input
            className={
              innError
                ? `${styles.searchFormInput} ${styles.searchFormInputError}`
                : styles.searchFormInput
            }
            type="text"
            id="inn"
            value={inn}
            onChange={(e) => setInn(e.target.value)}
            onBlur={(e) => handleValidateInn(e.target.value)}
            required
          />
          {innError && (
            <div className={styles.searchFormErrorText}>{innError}</div>
          )}
        </div>
        <div className={styles.searchFormGroup}>
          <label htmlFor="tonality">Тональность</label>
          <select
            className={styles.searchFormInput}
            name="tonality"
            id="tonality"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="positive">Позитивная</option>
            <option value="negative">Негативная</option>
            <option value="any">Любая</option>
          </select>
        </div>
        <div className={styles.searchFormGroup}>
          <label htmlFor="limit">Количество документов в выдаче*</label>
          <input
            className={
              docsAmountError
                ? `${styles.searchFormInput} ${styles.searchFormInputError}`
                : styles.searchFormInput
            }
            type="number"
            id="limit"
            value={docsAmount}
            onChange={(e) => setDocsAmount(e.target.value)}
            onBlur={(e) => handleValidateDocsAmount(e.target.value)}
            min="1"
            max="1000"
            required
          />
          {docsAmountError && (
            <div className={styles.searchFormErrorText}>{docsAmountError}</div>
          )}
        </div>
        <div className={styles.searchFormGroup}>
          <label htmlFor="dateStart">Диапазон поиска</label>
          <div className={styles.searchFormDates}>
            <input
              className={
                dateError
                  ? `${styles.searchFormInput} ${styles.searchFormInputError}`
                  : styles.searchFormInput
              }
              type="date"
              id="startDate"
              value={dateStart}
              onChange={(e) => {
                setDateStart(e.target.value);
                const err = validateDates(e.target.value, dateEnd);
                if (!err) setDateError("");
              }}
            />
            <input
              className={
                dateError
                  ? `${styles.searchFormInput} ${styles.searchFormInputError}`
                  : styles.searchFormInput
              }
              type="date"
              id="endDate"
              value={dateEnd}
              onChange={(e) => {
                setDateEnd(e.target.value);
                const err = validateDates(dateStart, e.target.value);
                if (!err) setDateError("");
              }}
            />
            {dateError && (
              <div className={styles.searchFormErrorText}>{dateError}</div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.searchFormRight}>
        <div className={styles.searchFormCheckboxGroup}>
          <input
            className={styles.searchFormCheckbox}
            type="checkbox"
            id="maxFullness"
          />
          <label htmlFor="maxFullness">Признак максимальной полноты</label>
        </div>
        <div className={styles.searchFormCheckboxGroup}>
          <input
            className={styles.searchFormCheckbox}
            type="checkbox"
            id="isBusinessNews"
          />
          <label htmlFor="isBusinessNews">Упоминания в бизнес-контексте</label>
        </div>
        <div className={styles.searchFormCheckboxGroup}>
          <input
            className={styles.searchFormCheckbox}
            type="checkbox"
            id="onlyMainRole"
          />
          <label htmlFor="onlyMainRole">Главная роль в публикации</label>
        </div>
        <div className={styles.searchFormCheckboxGroup} data-disabled="true">
          <input
            className={styles.searchFormCheckbox}
            type="checkbox"
            id="onlyWithRiskFactors"
          />
          <label htmlFor="onlyWithRiskFactors">
            Публикации только с риск-факторами
          </label>
        </div>
        <div className={styles.searchFormCheckboxGroup} data-disabled="true">
          <input
            className={styles.searchFormCheckbox}
            type="checkbox"
            id="excludeTechNews"
          />
          <label htmlFor="excludeTechNews">
            Включать технические новости рынков
          </label>
        </div>
        <div className={styles.searchFormCheckboxGroup}>
          <input
            className={styles.searchFormCheckbox}
            type="checkbox"
            id="excludeAnnouncements"
          />
          <label htmlFor="excludeAnnouncements">
            Включать анонсы и календари
          </label>
        </div>
        <div className={styles.searchFormCheckboxGroup} data-disabled="true">
          <input
            className={styles.searchFormCheckbox}
            type="checkbox"
            id="excludeDigests"
          />
          <label htmlFor="excludeDigests">Включать сводки новостей</label>
        </div>
      </div>
      <div className={styles.submitGroup}>
        <button
          className={styles.submitButton}
          type="submit"
          disabled={!isFormValid || isSubmitting}
        >
          Поиск
        </button>
        <p>* Обязательные к заполнению поля</p>
      </div>
    </form>
  );
};

export default SearchForm;
