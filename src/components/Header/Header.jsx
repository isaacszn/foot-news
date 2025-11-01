import styles from './Header.module.css'

const Header = () => {
    return (
        <div className={styles.container}>
            <h1><a href="https://footnewsapp.vercel.app">FootNews ⚽</a></h1>
            <h2>Welcome, dear! 👋</h2>
        </div>
    )
}

export default Header