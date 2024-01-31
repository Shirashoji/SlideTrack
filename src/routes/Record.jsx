import PropTypes from "prop-types";
import "regenerator-runtime";
import { useEffect, useState, useMemo } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Button from "@mui/material/Button";
import LensIcon from "@mui/icons-material/Lens";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/system/Box";
import Fab from "@mui/material/Fab";
import Pagination from "@mui/material/Pagination";
import { ThemeProvider } from "@mui/material/styles";

import TranscriptionView from "../components/TranscriptionView";

import DownloadJSON from "../utils/DownloadJSON";

import { createTheme } from "@mui/material/styles";
import { deepOrange, grey } from "@mui/material/colors";

import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const buttonTheme = createTheme({
  palette: {
    recording: {
      main: deepOrange[500],
    },
    mute: {
      main: grey[500],
    },
    white: {
      main: "#fff",
    },
    black: {
      main: "#000",
    },
  },
});

export default function Record() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [records, setRecords] = useState([]);
  const [recordingMode, setRecordingMode] = useState(false);
  const [numPages, setNumPages] = useState(); // PDFの全ページ数
  const [pageNumber, setPageNumber] = useState(1); // 現在表示中のページ番号

  useEffect(() => {
    if (recordingMode) {
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
    }
  }, [listening, recordingMode]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn&apos;t support speech recognition.</span>;
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!listening && transcript !== "") {
      setRecords((prevRecords) => [
        ...prevRecords,
        { time: new Date(Date.now()), text: transcript, page: pageNumber },
      ]);
    }
  }, [listening, transcript]);

  const slideViewContent = useMemo(() => (
    <SlideView
      numPages={numPages}
      setNumPages={setNumPages}
      pageNumber={pageNumber}
    />
  ), [numPages, pageNumber]);

  return (
    <div id="main">
      <Stack
        direction={{ md: "column", lg: "row" }}
        justifyContent="center"
        alignItems={{ md: "center", lg: "stretch" }}
        spacing={2}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs>
            {slideViewContent}
          </Grid>
          <Pagination
            count={numPages}
            page={pageNumber}
            onChange={(e, value) => {
              setPageNumber(value);
            }}
            size="large"
            showFirstButton
            showLastButton
            sx={{ my: 1 }}
          />
          <ThemeProvider theme={buttonTheme}>
            <Grid item xs>
              {recordingMode ? (
                <Fab
                  color="recording"
                  onClick={() => setRecordingMode(!recordingMode)}
                >
                  <LensIcon color="white" />
                </Fab>
              ) : (
                <Fab
                  color="mute"
                  onClick={() => setRecordingMode(!recordingMode)}
                >
                  <LensIcon color="white" />
                </Fab>
              )}
            </Grid>
          </ThemeProvider>
          <Grid item xs>
            <Stack direction="row" spacing={2}>
              <Button
                color="warning"
                variant="contained"
                onClick={resetTranscript}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  return DownloadJSON(records);
                }}
              >
                Download
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <TranscriptionView
          records={records}
          transcript={transcript}
          setPage={setPageNumber}
        />
      </Stack>
    </div>
  );
}

function SlideView(props) {
  SlideView.propTypes = {
    numPages: PropTypes.number.isRequired,
    setNumPages: PropTypes.func.isRequired,
    pageNumber: PropTypes.number.isRequired,
  };

  const { numPages, setNumPages, pageNumber } = props;

  const uri = localStorage.getItem('pdf');
  let fileUrl;
  if (uri) {
    const binary = atob(uri.replace(/data:.*\/.*;base64,/, ''));
    let bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const file = new Blob([bytes], { type: 'application/pdf' });
    fileUrl = URL.createObjectURL(file);
  } else {
    fileUrl = '../../sampleData/SlideTrack_meeting.pdf';
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Box
      component="section"
      height={numPages === undefined ? 550 : "auto"}
      width={900}
      maxWidth="95vw"
      sx={{ border: "1px dashed grey" }}
    >
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          pageNumber={pageNumber}
          width={900 - 1 /*横幅は右枠線の太さ1px分だけ小さくする必要あり*/}
        />
      </Document>
    </Box>
  );
}
