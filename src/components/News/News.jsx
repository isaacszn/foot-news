import styles from './News.module.css'

const News = () => {
    const loading = true;
    const data = false;

    return (
        <div className={styles.container}>
            <h1>News</h1>
            {loading && !data ? <span className={styles.loader}>Loading...</span> : <span>Data</span>}
        </div>
    )
}

export default News