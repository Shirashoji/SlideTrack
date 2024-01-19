import React, { useCallback, useState } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';

export default function Upload() {
  const theme = useTheme();
  const [pdfFiles, setPdfFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newPdfFiles = acceptedFiles.filter((file) => file.type === 'application/pdf');

      if (newPdfFiles.length > 0) {
        setPdfFiles((prevPdfFiles) => [...prevPdfFiles, ...newPdfFiles]);
        setErrorMessage('');
      } else {
        setErrorMessage('無効なファイルタイプです.PDFファイルを選択してください.');
      }
    }
  }, []);

  const removePdfFile = (index) => {
    const updatedPdfFiles = [...pdfFiles];
    updatedPdfFiles.splice(index, 1);
    setPdfFiles(updatedPdfFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/pdf',
    onDrop,
  });

  const dropzoneStyle = {
    border: `2px dashed ${isDragActive ? '#ff9800' : '#2196f3'}`,
    backgroundColor: isDragActive ? '#ffe0b2' : '#f0f0f0',
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        overflow: 'auto',
      }}
    >
      <div {...getRootProps({ style: dropzoneStyle })}>
        <input {...getInputProps()} accept="application/pdf" />
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: 'black',
            fontWeight: 'bold',
            marginBottom: theme.spacing(2),
            fontSize: 'calc(5vw)',
            textAlign: 'center',
            textShadow: '2px 2px 3px rgba(0, 0, 0, 0.3)',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          PDFファイルを選択
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: '#666',
            fontSize: 'calc(2vw)',
          }}
        >
          または、ここに PDF をアップロードしてください
        </Typography>
      </div>

      {errorMessage && (
        <Typography variant="body2" color="error" sx={{ marginTop: theme.spacing(1) }}>
          {errorMessage}
        </Typography>
      )}

      {pdfFiles.length > 0 && (
        <div>
          {pdfFiles.map((file, index) => (
            <div key={index} style={{ marginTop: theme.spacing(2) }}>
              <embed
                src={URL.createObjectURL(file)}
                type="application/pdf"
                width="100%"
                height="300px"
                style={{ border: '1px solid #ccc' }}
              />
              <div style={{ marginTop: theme.spacing(1) }}>
                <Button variant="contained" color="success">
                  OK
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  style={{ marginLeft: theme.spacing(1) }}
                  onClick={() => removePdfFile(index)}
                >
                  Clear
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Paper>
  );
}
