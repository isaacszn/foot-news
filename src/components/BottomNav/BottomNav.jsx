import home from '../../assets/icons/home.svg'
import fixtures from '../../assets/icons/fixtures.svg'
import more from '../../assets/icons/more.svg'
import styles from './BottomNav.module.css'

const BottomNav = () => {
    return (
        <div className={styles.container}>
            <ul>
                <div><li><img src={home} alt="Home" /></li>Home</div>
                <div><li><img src={fixtures} alt="Fixtures" /></li>Ball Fixtures</div>
                <div><li><img src={more} alt="More" /></li>More</div>
            </ul>
        </div>
    )
}

export default BottomNav