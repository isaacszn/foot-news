import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage'
import Home from './pages/Home/Home'
import Fixtures from './pages/Fixtures/Fixtures'
import More from './pages/More/More'
import NotFound from './pages/NotFound/NotFound'

const App = () => {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/fixtures" element={<Fixtures />}></Route>
                    <Route path="/more" element={<More />}></Route>
                    <Route path="*" element={<NotFound />}></Route>
                </Routes>
            </BrowserRouter>
        )
}

export default App;
