import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const RegisterSticky = ({ scrollToContactForm }) => {
  const [time, setTime] = useState(15 * 60);

  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <>
      <div className={styles.bottomfix}>
        <div className="container">
          <div className="row py-lg-4 py-2">
            <div className="col-lg-6 d-lg-block d-none">
              <div className={styles.meuntitle}>
                <h4>
                  Property Law · Career Masterclass — June 6, 2026
                </h4>
                <h6>
                  Offer Will Expire in - <span>{`${minutes}:${
                    seconds < 10 ? `0${seconds}` : seconds
                  }`}</span>
                </h6>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="pricing d-flex justify-content-lg-end justify-content-between align-items-center gap-3 py-md-1 py-2">
                <div>
                  <p className={styles.pricing}>
                    INR ₹499
                    <br />
                    {/* <span>Early access</span> */}
                  </p>
                  <p className={styles.mbinfo}>
                    (Seats filling fast — {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`})
                  </p>
                </div>
                <div className={styles.pricebtn}>
                  <button
                    onClick={scrollToContactForm}
                    className="btn text-light"
                    style={{ cursor: "pointer", borderRadius: "20px" }}
                  >
                    Register Here
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterSticky;
