import React from "react";
import styles from "./PublicationCard.module.css";

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

interface PublicationCardProps {
  doc: DocType;
}

const parseContentMarkup = (markup: string) => {
  if (!markup) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, "text/xml");

    const sentenceElements = doc.querySelectorAll("sentence");
    let content = Array.from(sentenceElements)
      .map((sentence) => sentence.textContent)
      .join(" ");

    content = content.replace(/<[^>]*>/g, "");

    content = content.replace(/\s+/g, " ").trim();

    const sentences = content.split(/\.\s+/);
    const paragraphs = [];
    let currentParagraph = "";

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i]?.trim() || "";
      if (sentence.length === 0) continue;

      const sentenceWithDot = sentence.endsWith(".")
        ? sentence
        : sentence + ".";

      if (currentParagraph === "" || sentence.length < 100) {
        currentParagraph += (currentParagraph ? " " : "") + sentenceWithDot;
      } else {
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
        }
        currentParagraph = sentenceWithDot;
      }
    }

    if (currentParagraph) {
      paragraphs.push(currentParagraph);
    }

    return paragraphs;
  } catch (error) {
    console.error("Error parsing content markup:", error);
    let cleanText = markup
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return cleanText.split(/\.\s+/).filter((p) => p.trim().length > 0);
  }
};

const PublicationCard: React.FC<PublicationCardProps> = ({ doc }) => {
  const { issueDate, source, title, content, url, attributes } = doc;

  const parsedContent = parseContentMarkup(content?.markup);

  const tags = [];
  if (attributes?.isTechNews) tags.push("Технические новости");
  if (attributes?.isAnnouncement) tags.push("Анонсы и события");
  if (attributes?.isDigest) tags.push("Сводки новостей");

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.date}>
          {new Date(issueDate).toLocaleDateString()}
        </span>
        {source?.name && (
          <a
            className={styles.source}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {source.name}
          </a>
        )}
      </div>
      <div className={styles.title}>
        <h3>{title?.text}</h3>
      </div>
      <div className={styles.tags}>
        {tags.map((tag, idx) => (
          <span className={styles.tag} key={idx}>
            {tag}
          </span>
        ))}
      </div>
      <div className={styles.content}>
        {parsedContent ? (
          Array.isArray(parsedContent) ? (
            parsedContent.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>{parsedContent}</p>
          )
        ) : (
          "Контент недоступен"
        )}
      </div>
      <div className={styles.footer}>
        <a
          className={styles.readBtn}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Читать в источнике
        </a>
        <span className={styles.wordCount}>
          {attributes?.wordCount ? `${attributes.wordCount} слова` : ""}
        </span>
      </div>
    </div>
  );
};

export default PublicationCard;
