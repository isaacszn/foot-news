import { Link } from 'react-router-dom'
import home from '../../assets/icons/home.svg'
import fixtures from '../../assets/icons/fixtures.svg'
import more from '../../assets/icons/more.svg'
import styles from './BottomNav.module.css'

const BottomNav = () => {
    return (
      <div className={styles.container}>
        <Link to="/home" className={styles.container_item}>
          <img src={home} alt="Home" />
          <span>Home</span>
        </Link>
        <Link to="/fixtures" className={styles.container_item}>
          <img src={fixtures} alt="Fixtures" />
          <span>Ball Fixtures</span>
        </Link>
        <Link to="/more" className={styles.container_item}>
          <img src={more} alt="More" />
          <span>More</span>
        </Link>
      </div>
    );
}

export default BottomNav