import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import News from './pages/News'
import Fixtures from './pages/Fixtures'
import More from './pages/More'
import NotFound from './pages/NotFound'

const App = () => {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>
                    <Route path="/home" element={<News />}></Route>
                    <Route path="/fixtures" element={<Fixtures />}></Route>
                    <Route path="/more" element={<More />}></Route>
                    <Route path="*" element={<NotFound />}></Route>
                </Routes>
            </BrowserRouter>
        )
}

export default App;
