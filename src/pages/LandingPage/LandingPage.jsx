import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <>
      <div className={styles.container}>
        <h1>FootNews ⚽</h1>
        <p className={styles.container_text}>
          Keep track of latest football news, signings, scores, fixtures and
          lots more...on <span className={styles.container_highlight}>FootNews ⚽</span>
        </p>
        <Link to="/home">
          <button className={styles.container_btn}>Kick off!! ⚽</button>
        </Link>
      </div>
    </>
  );
};

export default LandingPage;
