import Title from "@/common/Title";
import styles from "./styles.module.css";
import { DynamicIcon } from "lucide-react/dynamic";
import { programConfig } from "@/constants/Home";
import { isRegistrationOpen, PRICE_ANNOUNCEMENT_TEXT, DATE_TIME_ANNOUNCEMENT_TEXT } from "@/utils/programStatus";

const FastFact = ({ factdata, config = programConfig }) => {
  const activeConfig = config || programConfig;
  const isRegOpen = isRegistrationOpen(activeConfig);

  // If factdata is the new problem section object (has cards), render problem layout
  const isProblem = factdata && Array.isArray(factdata.cards);

  if (isProblem) {
    const section = factdata;
    return (
      <section className={styles.factsec}>
        <div className="container">
          <div className="d-flex justify-content-center flex-column align-items-center text-center mb-4">
            <Title
                title2={"never enter property law"}
                spantitle={"Why most advocates"}
                subtitle={"This session is designed to simplify the roadmap — so advocates can finally understand the field, opportunities, and practical side of property law practice."}
              />
            {/* <p className={styles.mainSubtitle}>
              {section.subheading || "This session is designed to simplify the roadmap — so advocates can finally understand the field, opportunities, and practical side of property law practice."}
            </p> */}
          </div>

          <div className="row mt-4">
            {section.cards.map((c) => (
              <div className="col-lg-4 col-md-6 mb-4" key={c.id}>
                <div className={styles.factpointcard}>
                  <div className={styles.cardIcon}>
                    <DynamicIcon name={c.icon || "circle-check"} size={32} color="#b20a0a" />
                  </div>
                  <h5 className={styles.cardTitle}>{c.title}</h5>
                  <p className={styles.cardDesc}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default fast-fact layout (legacy)
  return (
    <section className={styles.factsec}>
      <div className="container">
        <div className="d-flex justify-content-center">
          <Title title1={"Fast"} spantitle={"Facts"} />
        </div>

        <div className="row mt-5">
          <div className="col-lg-6">
            <div className={styles.factimg}>
              <img src={"/assets/home/fatsfact.jpeg"} className="img-fluid" />
            </div>
          </div>
          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="row">
              {factdata?.map((data, i) => {
                let displayValue = data?.value;
                if (data?.icon === "calendar-clock" || data?.icon === "calendar") {
                  displayValue = isRegOpen
                    ? (activeConfig?.date ? `${activeConfig.date} • ${activeConfig.time}` : data?.value)
                    : DATE_TIME_ANNOUNCEMENT_TEXT;
                } else if (data?.icon === "hand-coins" || data?.icon === "banknote" || data?.icon === "indian-rupee") {
                  displayValue = isRegOpen
                    ? `₹${activeConfig?.fee || 499} (Early access)`
                    : PRICE_ANNOUNCEMENT_TEXT;
                }

                return (
                  <div className="col-xxl-6 col-xl-12" key={i}>
                    <div
                      className={`d-flex align-items-center  my-3 gap-3 ${styles.factpointcard} `}
                    >
                      <div className={styles.cardimg}>
                        <DynamicIcon
                          name={data?.icon}
                          color="#b20a0a"
                          size={30}
                        />
                      </div>
                      <p>{displayValue}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FastFact;
