import "regenerator-runtime";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [records, setRecords] = useState([]);

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

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
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
