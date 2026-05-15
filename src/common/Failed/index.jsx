import React from "react";
import styles from "./styles.module.css";

export const FailedMessage = ({ onClose }) => {
  return (
    <div className={styles.failedWrapper}>
      <div className="o-circle c-container__circle o-circle__sign--failure">
        <div className="o-circle__sign"></div>
      </div>
      <p className={styles.title}>Oops !</p>
      <p className={styles.description}>
        Something went wrong. Please try again later
      </p>
    <button
        className="btn btn-primary btn-md "
        style={{ borderRadius: "20px" }}
        onClick={onClose}
      >
        Try Again
      </button>
    </div>
  );
};
