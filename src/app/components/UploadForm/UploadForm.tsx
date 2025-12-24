'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './UploadForm.module.css';

export default function UploadForm() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Prevent drop on whole window
    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        setError('');
        setFile(droppedFile);
      } else {
        setError('Must be an excel file that ends with .xls or .xslx');
      }
    }
  }

  function handleClick() {
    if (fileInputRef) {
      fileInputRef.current?.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <form className={styles.form}>
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='.xlsx, .xls'
          onChange={handleFileChange}
          className={styles.inputHidden}
        />
        {dragActive ? (
          <p>Drop file here</p>
        ) : file ? (
          <p>
            Selected: <span className={styles.fileName}>{file.name}</span>
          </p>
        ) : (
          <p>Drag and drop Excel file here or</p>
        )}
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className={`${styles.button} ${dragActive ? styles.browseBtnHidden : ''}`}
        >
          Browse Files
        </button>
        <p>{error ? error : null}</p>
      </div>
      <button className={`${styles.button}`}>Summerise + Download</button>
    </form>
  );
}
