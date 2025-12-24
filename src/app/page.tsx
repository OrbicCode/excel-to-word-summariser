'use client';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Excel to Word Summariser</h1>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <input type='file' />
        </form>
      </div>
    </main>
  );
}
