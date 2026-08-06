import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { programConfig } from "@/constants/Home";
import { isRegistrationOpen, getPrimaryCtaText } from "@/utils/programStatus";

const RegisterSticky = ({ scrollToContactForm, config = programConfig }) => {
  const activeConfig = config || programConfig;
  const isRegOpen = isRegistrationOpen(activeConfig);
  const ctaText = getPrimaryCtaText(activeConfig);

  const [time, setTime] = useState(15 * 60);

  useEffect(() => {
    if (!isRegOpen || time <= 0) return;

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, isRegOpen]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <>
      <div className={styles.bottomfix}>
        <div className="container">
          <div className="row py-lg-4 py-2 align-items-center">
            <div className={isRegOpen ? "col-lg-6 d-lg-block d-none" : "col-lg-8 col-md-7 col-12 mb-lg-0 mb-1"}>
              <div className={styles.meuntitle}>
                <h4>
                  {activeConfig?.name || "Property Law · Career Masterclass"}
                  {isRegOpen && activeConfig?.date ? ` — ${activeConfig.date}` : ""}
                </h4>
                {isRegOpen && (
                  <h6>
                    Offer Will Expire in - <span>{`${minutes}:${
                      seconds < 10 ? `0${seconds}` : seconds
                    }`}</span>
                  </h6>
                )}
              </div>
            </div>
            <div className={isRegOpen ? "col-lg-6 col-md-12" : "col-lg-4 col-md-5 col-12 d-flex justify-content-lg-end justify-content-center"}>
              <div className="pricing d-flex justify-content-lg-end justify-content-between align-items-center gap-3 py-md-1 py-2">
                {isRegOpen && (
                  <div>
                    <p className={styles.pricing}>
                      INR ₹{activeConfig?.fee || 499}
                    </p>
                    <p className={styles.mbinfo}>
                      (Seats filling fast — {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`})
                    </p>
                  </div>
                )}
                <div className={styles.pricebtn}>
                  <button
                    onClick={scrollToContactForm}
                    className="btn text-light"
                    style={{ cursor: "pointer", borderRadius: "20px" }}
                  >
                    {ctaText}
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
