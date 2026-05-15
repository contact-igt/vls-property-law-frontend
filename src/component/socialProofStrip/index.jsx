import styles from "./styles.module.css";
import CountUp from "react-countup";

const SocialProof = ({ stats }) => {
  const items =
    stats || [
      { id: 1, number: "25+", label: "Bootcamps Conducted" },
      { id: 2, number: "1,200+", label: "Advocates Trained" },
      { id: 3, number: "250+", label: "Judicial Officers Trained" },
      { id: 4, number: "12+", label: "Legal Practice Areas Covered" },
      { id: 5, number: "200+", label: "Hours of Legal Training" },
    ];

  // Parse number and extract suffix/prefix
  const parseNumber = (numStr) => {
    if (!numStr) return { value: 0, suffix: "" };
    
    // Remove commas and extract number
    const cleanStr = numStr.replace(/,/g, "");
    const match = cleanStr.match(/(\d+)(.*)/);
    
    if (match) {
      return {
        value: parseInt(match[1], 10),
        suffix: match[2] || "",
      };
    }
    
    return { value: 0, suffix: "" };
  };

  return (
    <section className={styles.socialProof}>
      <div className="container">
        <div className={styles.statsRow}>
          {items.map((item, index) => {
            const { value, suffix } = parseNumber(item.number);
            
            return (
              <div key={item.id} className={styles.statItem}>
                <div className={styles.statNumber}>
                  <CountUp
                    start={0}
                    end={value}
                    duration={2}
                    delay={index * 0.2}
                    separator={value >= 1000 ? "," : ""}
                    suffix={suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <div className={styles.statLabel}>{item.label ?? item.number}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
