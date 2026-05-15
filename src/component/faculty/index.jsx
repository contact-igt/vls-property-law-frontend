import Title from "@/common/Title";
import styles from "./styles.module.css";

const Faculty = ({ facultydata }) => {
  return (
    <section className={styles.facultysec}>
      <div className="container">
        <div className="d-flex justify-content-center">
          <Title title1={"Your"} spantitle={"Faculty"} />
        </div>

        <div className={`${styles.facultycard} mt-5`}>
          <div className="row">
            <div className="col-lg-6">
              <div className={styles.facultyinfo}>
                <h3>{facultydata?.title ?? facultydata?.name}</h3>
                <h4>{facultydata?.subtitle}</h4>

                <ul className={styles.creds}>
                  {facultydata?.credentials?.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>

                {facultydata?.quote ? (
                  <p className={styles.quote}>&ldquo;{facultydata.quote}&rdquo;</p>
                ) : null}
              </div>
            </div>

            <div className="col-lg-6 d-flex flex-column justify-content-end">
              <div className={styles.facultyimg}>
                <img
                  src={facultydata?.image}
                  className="img-fluid"
                  alt={facultydata?.title ?? facultydata?.name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faculty;
