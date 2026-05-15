import { useState } from "react";
import styles from "./styles.module.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header>
      <div className="container-fluid">
        <nav className={`${styles.navbar} navbar navbar-expand-lg px-3`}>
          <div className={styles.navlogo}>
            <a className="navbar-logo" href="https://www.vlslawacademy.com/">
              <img src={"/assets/home/vls_logo.png"} alt="logo" />
            </a>
          </div>

          {/* Toggle Button */}
          <button
            className={` ${styles.navbarToggler} ${isOpen ? styles.open : ""}`}
            type="button"
            onClick={toggleNavbar}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Collapsible Menu */}
          <div
            className={`collapse navbar-collapse justify-content-between ${
              styles.submenu
            } ${isOpen ? "show" : ""}`}
            id="navbarSupportedContent"
          >
            <ul
              className={`nav navbar-nav navbar-right w-100 justify-content-center ${styles.pagemenu}`}
            >
              <li className="dropdown submenu">
                <a href="https://www.vlslawacademy.com/">Home</a>
              </li>
              <li className="dropdown submenu">
                <a href="https://www.vlslawacademy.com/courses">Courses</a>
              </li>
              <li className="dropdown submenu">
                <a href="https://www.vlslawacademy.com/whyvls">Why VLS</a>
              </li>
              <li className="dropdown submenu">
                <a href="https://www.vlslawacademy.com/contact">Contact</a>
              </li>
            </ul>

            <div className={`${styles.nav_social_box}`}>
              <a href="tel:+919500207811" target="_blank">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </a>
              <a
                href="https://www.instagram.com/vlslawacademy/"
                target="_blank"
              >
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="https://www.youtube.com/@VLSLAWACADEMY" target="_blank">
                <i className="fa fa-youtube-play" aria-hidden="true"></i>
              </a>

              <a
                href="https://www.linkedin.com/company/105212369/admin/dashboard/"
                target="_blank"
              >
                <i className="fa fa-linkedin" aria-hidden="true"></i>
              </a>
              <a href="https://www.facebook.com/vlslawacademy" target="_blank">
                <i className="fa fa-facebook" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
