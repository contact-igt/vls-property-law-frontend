import Image from "next/image";
import { DynamicIcon } from "lucide-react/dynamic";
import Title from "@/common/Title";
import ContactForm from "../contactform";
import styles from "./styles.module.css";
import { programConfig } from "@/constants/Home";
import { isRegistrationOpen, DATE_TIME_ANNOUNCEMENT_TEXT } from "@/utils/programStatus";

const Banner = ({ bannerdata = {}, contactFormRef, ipName, config = programConfig }) => {
  const activeConfig = config || programConfig;
  const isRegOpen = isRegistrationOpen(activeConfig);
  const points = bannerdata?.points ?? [];

  const timeDisplay = isRegOpen
    ? (activeConfig?.date ? `${activeConfig.date} • ${activeConfig.time}` : bannerdata?.heading?.time)
    : DATE_TIME_ANNOUNCEMENT_TEXT;

  return (
    <section className={styles.bannersec} aria-label="Hero banner">
      {/* Background image handled by next/image for best performance */}
      <div className={styles.bgWrap} aria-hidden="true">
        <Image
          src="/assets/home/banner-img.jpg"
          alt={bannerdata?.heading?.title || "Banner image"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
          className={styles.bgimg}
        />
      </div>

      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-6 col-12 pt-xl-5 pt-0">
            <div className={styles.bannertitle}>
              {bannerdata?.heading?.tag ? (
                <div className={styles.herotag}>{bannerdata.heading.tag}</div>
              ) : null}
              <Title
                title2={bannerdata?.heading?.title}
                spantitle={bannerdata?.heading?.titlebold}
                subtitle={bannerdata?.heading?.desc}
              />
            </div>

            <div
              className={`${styles.datetime} d-flex gap-2 align-items-center`}
            >
              <DynamicIcon name="clock" color="#fff" />
              <h6 className="m-0">{timeDisplay}</h6>
            </div>

            <div className={`${styles.bannerpoint} my-5`}>
              {points.map((item, idx) => {
                let descText = item?.desc;
                if (!isRegOpen && (item?.id === 1 || item?.desc?.includes("June 6") || item?.desc?.includes("Saturday"))) {
                  descText = DATE_TIME_ANNOUNCEMENT_TEXT;
                }
                return (
                  <div
                    className={`${styles.pointItem} d-flex align-items-start gap-3 my-3`}
                    key={item?.id ?? idx}
                  >
                    <div className={styles.iconWrap} aria-hidden="true">
                      <DynamicIcon name="gavel" color="#b20a0a" size={22} />
                    </div>
                    <h5 className={styles.pointText}>{descText}</h5>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-xl-5 col-lg-6 col-12">
            <div ref={contactFormRef}>
              <ContactForm ipAddress={ipName} config={activeConfig} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
