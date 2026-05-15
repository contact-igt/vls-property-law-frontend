import Button from "@/common/Button";
import styles from "./styles.module.css";
import Title from "@/common/Title";

const WhyCourse = ({ scrollToContactForm }) => {
  return (
    <section className={styles.whycouresec}>
      <div className="container">
        <div className="row ">
          <div className="col-lg-6">
            <div className={styles.course}>
              <Title title1={"Why This"} spantitle={"MasterClass ?"} />

              <p className="my-5">
                {" "}
                Law school gives you theory. We give you real courtroom
                practice. Whether you aim to become a judge, a practicing
                advocate, or a corporate lawyer — this course gives you the
                hands-on legal skills you need to start your career with clarity
                and confidence
              </p>

              <Button
                name={"Learn More"}
                scrollToContactForm={scrollToContactForm}
              />
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className={styles.courseimg}>
              <img src={"/assets/home/whycourse.jpeg"} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCourse;
