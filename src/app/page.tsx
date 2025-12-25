'use client';

import UploadForm from './components/UploadForm/UploadForm';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>
        Prototype
        <br />
        Excel to Word AI Summariser
      </h1>
      <div className={styles.formContainer}>
        <UploadForm />
      </div>
    </main>
  );
}
