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

const Dictaphone = () => {
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
    <div>
      <p>Microphone: {recordingMode ? "on" : "off"}</p>
      <Stack direction="row" spacing={2}>
        {recordingMode ? (
          <IconButton onClick={() => setRecordingMode(!recordingMode)}>
            <MicIcon color="primary" />
          </IconButton>
        ) : (
          <IconButton onClick={() => setRecordingMode(!recordingMode)}>
            <MicOffIcon />
          </IconButton>
        )}
        <Button color="warning" variant="contained" onClick={resetTranscript}>
          Reset
        </Button>
        <Button variant="contained" onClick={() => DownloadJSON(records)}>
          Download
        </Button>
      </Stack>
      <p>speech now: {transcript}</p>
      <p>records:</p>
      <ul>
        {records.map((record) => (
          <li key={record.time}>
            {record.time.getHours()}:{record.time.getMinutes()}:
            {record.time.getSeconds()}: {record.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

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

export default Dictaphone;
