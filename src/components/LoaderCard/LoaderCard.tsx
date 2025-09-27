import styles from "./LoaderCard.module.css";
import Spinner from "../Spinner/Spinner";

type Props = { minHeight?: number; className?: string };

const LoaderCard: React.FC<Props> = ({ minHeight = 120, className }) => (
  <div
    className={`${styles.card} ${className ?? ""}`}
    aria-busy="true"
    aria-live="polite"
    style={{ minHeight }}
  >
    <Spinner size={28} />
  </div>
);

export default LoaderCard;
