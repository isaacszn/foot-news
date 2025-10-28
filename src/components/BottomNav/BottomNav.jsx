import home from '../../assets/icons/home.svg'
import fixtures from '../../assets/icons/fixtures.svg'
import more from '../../assets/icons/more.svg'
import styles from './BottomNav.module.css'

const BottomNav = () => {
    return (
        <div className={styles.container}>
            <ul>
                <li><img src={home} alt="Home" /></li>
                <li><img src={fixtures} alt="Fixtures" /></li>
                <li><img src={more} alt="More" /></li>
            </ul>
        </div>
    )
}

export default BottomNav