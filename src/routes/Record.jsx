import "regenerator-runtime";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function Record() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [records, setRecords] = useState([]);
  const [recordingMode, setRecordingMode] = useState(false);

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
      <h1>Record</h1>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs>
          {recordingMode ? (
            <IconButton
              color="primary"
              variant="contained"
              onClick={() => setRecordingMode(!recordingMode)}
            >
              <MicIcon color="primary" />
            </IconButton>
          ) : (
            <IconButton onClick={() => setRecordingMode(!recordingMode)}>
              <MicOffIcon />
            </IconButton>
          )}
        </Grid>
        <Grid item xs>
          <Stack direction="row" spacing={2}>
            <Button
              color="warning"
              variant="contained"
              onClick={resetTranscript}
            >
              Reset
            </Button>
            <Button variant="contained" onClick={() => DownloadJSON(records)}>
              Download
            </Button>
          </Stack>
        </Grid>
        <Grid item xs>
          <p>listening: {listening ? "on" : "off"}</p>
        </Grid>
        <Grid item xs>
          <p>speech now: {transcript}</p>
        </Grid>
      </Grid>
    </div>
  );
}

function DownloadJSON(jsonData) {
  if (!jsonData || jsonData.length === 0) return null;
  const date = new Date(Date.now());
  const fileName = `record_${date.getFullYear()}${(
    "0" + String(date.getMonth() + 1)
  ).slice(-2)}${("0" + String(date.getDate())).slice(-2)}-${(
    "0" + String(date.getHours())
  ).slice(-2)}${("0" + String(date.getMinutes())).slice(-2)}${(
    "0" + String(date.getSeconds())
  ).slice(-2)}.json`;
  const blobData = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
