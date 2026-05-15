import Title from "@/common/Title";
import { DynamicIcon } from "lucide-react/dynamic";
import styles from "./styles.module.css";
import Button from "@/common/Button";

const WhoJoin = ({ whojoindata, scrollToContactForm }) => {
  // support both legacy array-of-strings and new structured object
  const section = Array.isArray(whojoindata)
    ? {
        eyebrow: 'Who should attend?',
        heading: 'This session is ideal for',
        items: whojoindata.map((t, i) => ({ id: i + 1, title: t })),
      }
    : whojoindata;

  return (
    <section className={styles.whojoinsec}>
      <div className="container">
        <div className="row  ">
          <div className="col-lg-6">
            <div className={styles.learnimg}>
              <img src={"/assets/home/whojoin.jpeg"} className="img-fluid" />
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0">
            <Title title2={"Should Attend ?"} spantitle={"Who"} />

            <div className="pt-2 pb-4">
              {section?.items?.map((item, i) => (
                <div
                  key={item.id ?? i}
                  className={`${styles.learnpt} d-flex gap-3 align-items-start my-4`}
                >
                  <DynamicIcon name="circle-check" size={25} color="#b20a0a" />
                  <div>
                    <h5>{item.title}</h5>
                    {item.desc ? <p className={styles.itemDesc}>{item.desc}</p> : null}
                  </div>
                </div>
              ))}
            </div>

            <Button
              name={"Attend Now"}
              scrollToContactForm={scrollToContactForm}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoJoin;
