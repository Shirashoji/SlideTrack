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
  const [pageNumber, setPageNumber] = useState(0);

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
            <SlideView pageNumber={pageNumber} />
          </Grid>
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
  const { pageNumber } = props;
  return (
    <Box
      component="section"
      height={550}
      width={900}
      maxWidth="95vw"
      sx={{ p: 2, border: "1px dashed grey" }}
    >
      スライド{pageNumber}
    </Box>
  );
}
