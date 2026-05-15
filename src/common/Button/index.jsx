import { DynamicIcon } from "lucide-react/dynamic";
import styles from "./styles.module.css";

const Button = ({ name, scrollToContactForm, icon, iconPosition = "left", isLoading, type, link }) => {
  if (link) {
    return (
      <a href={link} className={styles.commonbtn}>
        {icon && iconPosition === "left" && <DynamicIcon name={icon} size={20} />}

        {isLoading ? (
          <span
            className="spinner-border spinner-border-sm text-light"
            role="status"
          ></span>
        ) : (
          <>
            <span>{name}</span>
            {icon && iconPosition === "right" && <DynamicIcon name={icon} size={20} />}
          </>
        )}
      </a>
    );
  }

  return (
    <button
      type={type || "button"}
      onClick={scrollToContactForm}
      className={styles.commonbtn}
    >
      {icon && iconPosition === "left" && <DynamicIcon name={icon} size={20} />}

      {isLoading ? (
        <span
          className="spinner-border spinner-border-sm text-light"
          role="status"
        ></span>
      ) : (
        <>
          <span>{name}</span>
          {icon && iconPosition === "right" && <DynamicIcon name={icon} size={20} />}
        </>
      )}
    </button>
  );
};

export default Button;
