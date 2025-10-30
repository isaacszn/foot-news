import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import Leagues from '../../components/Leagues/Leagues'
import News from '../../components/News/News'

const Home = () => {
    return (
        <>
         <div>
            <Header />
            <Leagues />
            <News />
            <BottomNav />
         </div>
        </>
    )
}

export default Home