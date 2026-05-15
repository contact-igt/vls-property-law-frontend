import Title from "@/common/Title";
import styles from "./styles.module.css";
const Speaker = ({ speakerdata }) => {
  return (
    <section className={styles.speakersec}>
      <div className="container">
        <div className="d-flex justify-content-center">
          <Title title1={"Our"} spantitle={"Speaker"} />
        </div>

        <div className={`${styles.speakercard} mt-5`}>
          <div className="row">
            <div className="col-lg-6">
              <div className={styles.speakerinfo}>
                <h3>{speakerdata?.name}</h3>
                <h4>{speakerdata?.Education}</h4>
                <h5>{speakerdata?.position}</h5>
                <p>{speakerdata?.about}</p>
              </div>
            </div>
            <div className="col-lg-6 d-flex flex-column justify-content-end">
              <div className={styles.speakerimg}>
                <img src={speakerdata?.image} className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speaker;
