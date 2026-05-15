import { useRef } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import Button from "@/common/Button";
import ContactForm from "@/component/contactform";
import styles from "./styles.module.css";

const FinalCta = ({ ipAddress }) => {
  const formWrapRef = useRef(null);

  const scrollToFinalForm = () => {
    formWrapRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section className={styles.finalCtaSec}>
      <div className="container">
        <div className={styles.ctaContent}>
          <div className={styles.leftContent}>
            <div className={styles.eyebrow}>
              <DynamicIcon name="scale" size={20} />
              <span>Final Enrollment Call</span>
            </div>

            <h2>
              Property law is one of the fastest-growing legal{" "}
              <span>practice areas in Tamil Nadu.</span>
            </h2>

            <p>Start by understanding how the field actually works.</p>

            {/* <div className={styles.ctaAction}>
              <Button
                name="Reserve Your Seat for ₹499 →"
                scrollToContactForm={scrollToFinalForm}
              />
            </div> */}

            <div className={styles.trustBadges}>
              <div className={styles.badge}>
                <DynamicIcon name="video" size={20} />
                <div>
                  <strong>Live Masterclass</strong>
                  <span>Interactive session</span>
                </div>
              </div>
              <div className={styles.badge}>
                <DynamicIcon name="calendar" size={20} />
                <div>
                  <strong>June 6, 2026</strong>
                  <span>Save the date</span>
                </div>
              </div>
              <div className={styles.badge}>
                <DynamicIcon name="indian-rupee" size={20} />
                <div>
                  <strong>₹499 Only</strong>
                  <span>Limited seats</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightForm} ref={formWrapRef}>
            <div className={styles.formCard}>
              <ContactForm
                ipAddress={ipAddress}
                formId="final_cta_contact_form"
                className={styles.ctaFormShell}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
