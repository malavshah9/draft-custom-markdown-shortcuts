import { RTE } from "./components/RTE";
import styles from "./app.module.css";

function App() {
  return (
    <div className={styles.rteContainer}>
      <h3 className={styles.rteHeading}>Demo Editor by Malav Devang Shah</h3>
      <RTE />
    </div>
  );
}

export default App;
