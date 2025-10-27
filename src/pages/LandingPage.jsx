import { Link } from 'react-router-dom'
import '/src/assets/styles/landingpage.css'

const LandingPage = () => {
    return (
        <>
         <h1>FootNews ⚽</h1>
         <p>Keep track of latest football news, signings, scores, fixtures and lots more...on <span className='text-highlight'>FootNews ⚽</span></p>
         <Link to="/home"><button>Kick off!! ⚽</button></Link>
        </>
    )
}

export default LandingPage