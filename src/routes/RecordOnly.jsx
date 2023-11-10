import "regenerator-runtime";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

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
      {recordingMode ? (
        <IconButton onClick={() => setRecordingMode(!recordingMode)}>
          <MicIcon color="primary" />
        </IconButton>
      ) : (
        <IconButton onClick={() => setRecordingMode(!recordingMode)}>
          <MicOffIcon />
        </IconButton>
      )}
      <button onClick={resetTranscript}>Reset</button>
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
export default Dictaphone;
