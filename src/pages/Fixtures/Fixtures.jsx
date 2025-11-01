import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import Leagues from '../../components/Leagues/Leagues'
import FixtureResults from '../../components/FixtureResults/FixtureResults'

const Fixtures = () => {
    return (
        <>
         <Header />
         <Leagues />
         <FixtureResults />
         <BottomNav />
        </>
    )
}

export default Fixtures