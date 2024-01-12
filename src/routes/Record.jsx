import "regenerator-runtime";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Button from "@mui/material/Button";
import LensIcon from "@mui/icons-material/Lens";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/system/Box";
import Fab from "@mui/material/Fab";
import { ThemeProvider } from "@mui/material/styles";

import TranscriptionView from "../components/TranscriptionView";

import DownloadJSON from "../utils/DownloadJSON";

import { createTheme } from "@mui/material/styles";
import { deepOrange, grey } from "@mui/material/colors";

import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
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

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  useEffect(() => {
    if (!listening && transcript !== "")
      setRecords([
        ...records,
        { time: new Date(Date.now()), text: transcript },
      ]);
  }, [listening]);

  useEffect(() => {
    if (recordingMode) SpeechRecognition.startListening();
    else SpeechRecognition.stopListening();
  }, [listening, recordingMode]);

  return (
    <div id="main">
      <Stack direction={{ mg: "column", lg: "row" }} spacing={2}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs>
            <SlideView numPages={numPages} setNumPages={setNumPages} pageNumber={pageNumber} />
          </Grid>
          <p>
            スライド {pageNumber} / {numPages}
          </p>
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
        <TranscriptionView records={records} transcript={transcript} />
      </Stack>
    </div>
  );
}

function SlideView(props) {
  const { numPages, setNumPages, pageNumber } = props;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }
  
  return (
    <Box
      component="section"
      height={numPages === undefined ? 550 : "auto"}
      width={900}
      maxWidth="95vw"
      sx={{ border: "1px dashed grey" }}
    >
      <Document file="../../sampleData/SlideTrack_meeting.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={900 - 1 /*横幅は右枠線の太さ1px分だけ小さくする必要あり*/}/>
      </Document>
    </Box>
  );
}
