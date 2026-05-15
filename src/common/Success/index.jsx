import React from "react";
import styles from "./styles.module.css";

export const SuccessMessage = ({ onClose }) => {
  return (
    <div className={styles.successWrapper}>
      <div className="o-circle c-container__circle o-circle__sign--success">
        <div className="o-circle__sign"></div>
      </div>
      <p className={styles.title}>Thank You !</p>
      <p className={styles.description}>
        Your message has been received. We'll get back to you shortly.
      </p>
      <button
        className="btn btn-primary btn-md "
        style={{ borderRadius: "20px" }}
        onClick={onClose}
      >
        Go Back
      </button>
    </div>
  );
};
