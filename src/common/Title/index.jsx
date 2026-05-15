import styles from "./styles.module.css";

const Title = ({ title1, title2, spantitle, subtitle }) => {
  return (
    <div className={styles.commntitle}>
      <h4>
        {title1} <span>{` ${spantitle ? spantitle : ""} `}</span>
        {title2}
      </h4>
      {subtitle ? <p>{subtitle}</p> : ""}
    </div>
  );
};

export default Title;
