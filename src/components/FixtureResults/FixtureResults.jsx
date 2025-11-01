import styles from './FixtureResults.module.css'

const FixtureResults = () => {
    const loading = true;
    const data = false;

    return (
        <div className={styles.container}>
            <h1>Fixtures</h1>
            {loading && !data ? <span className={styles.loader}>Loading...</span> : <span>Data</span>}
        </div>
    )
}

export default FixtureResults