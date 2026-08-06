import Title from "@/common/Title";
import styles from "./styles.module.css";
import { programConfig } from "@/constants/Home";
import { isRegistrationOpen } from "@/utils/programStatus";

const FAQ = ({ faqdata, config = programConfig }) => {
  const activeConfig = config || programConfig;
  const isRegOpen = isRegistrationOpen(activeConfig);

  return (
    <section className={styles.faqsec}>
      <div className="container">
        <div className="d-flex justify-content-center">
          <Title
            title1={"Frequently"}
            spantitle={"Asked"}
            title2={"Questions ?"}
          />
        </div>

        <div className="accordion mt-5" id="faqAccordion">
          {faqdata?.map((item, i) => {
            let answer = item.answer;
            if (!isRegOpen && item.question?.toLowerCase().includes("after registration")) {
              answer = "You will receive confirmation of your waitlist status, and our team will notify you via WhatsApp and Email as soon as the next batch dates and fees are announced.";
            }

            return (
              <div className="accordion-item" key={i}>
                <h2 className={`accordion-header ${styles.faquestion}`} id={`heading${item.id}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${item.id}`}
                    aria-expanded="false"
                    aria-controls={`collapse${item.id}`}
                  >
                    {item.question}
                  </button>
                </h2>
                <div
                  id={`collapse${item.id}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${item.id}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className={` accordion-body ${styles.faqanswer}`}>{answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
