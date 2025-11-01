import { NavLink } from 'react-router-dom'
import home from '../../assets/icons/home.svg'
import fixtures from '../../assets/icons/fixtures.svg'
import more from '../../assets/icons/more.svg'
import styles from './BottomNav.module.css'

const BottomNav = () => {
    return (
      <div className={styles.container}>
        <NavLink to="/home" className={({ isActive }) => (isActive ? styles.nav_active : styles.container_item)}>
          <img src={home} alt="Home" width="35px" height="35px" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/fixtures" className={({ isActive }) => (isActive ? styles.nav_active : styles.container_item)}>
          <img src={fixtures} alt="Fixtures" width="35px" height="35px" />
          <span>Ball Fixtures</span>
        </NavLink>
        <NavLink to="/more" className={({ isActive }) => (isActive ? styles.nav_active : styles.container_item)}>
          <img src={more} alt="More" width="35px" height="35px" />
          <span>More</span>
        </NavLink>
      </div>
    );
}

export default BottomNav