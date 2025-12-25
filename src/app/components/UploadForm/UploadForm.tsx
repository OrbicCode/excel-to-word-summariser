'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './UploadForm.module.css';

export default function UploadForm() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);

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
    if (e.dataTransfer?.files?.[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        setFileError('');
        setFile(droppedFile);
      } else {
        setFile(null);
        setFileError('Must be an excel file that ends with .xls or .xslx');
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target?.files?.[0]) {
      setFile(e.target.files[0]);
      setFileError('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      return;
    }

    setIsLoading(true);
    setFileError('');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/summerise', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    const blob = await data.formData.blob();
    console.log(blob);

    try {
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div
        onClick={() => fileInputRef.current?.click()}
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
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className={`${styles.button} ${dragActive ? styles.browseBtnHidden : ''}`}
        >
          Browse Files
        </button>
        <p>{fileError ? fileError : null}</p>
        {file ? <div className={styles.arrow}>↓↓↓</div> : null}
      </div>
      {file && !isLoading ? (
        <button type='submit' disabled={isLoading} className={`${styles.button}`}>
          Summerise
        </button>
      ) : null}
    </form>
  );
}
