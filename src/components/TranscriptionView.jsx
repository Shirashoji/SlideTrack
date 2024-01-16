import PropTypes from "prop-types";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";

export default function TranscriptionView(props) {
  const { records, transcript } = props;

  TranscriptionView.propTypes = {
    records: PropTypes.array.isRequired,
    transcript: PropTypes.string.isRequired,
  };

  const currentTime = new Date(Date.now());
  // { time: new Date(Date.now()), text: transcript };
  return (
    <Paper style={{ overflowY: "scroll" }}>
      <Box component="section" height="75vh" width={500} maxWidth="95vw">
        <ul>
          {records.map((record) => (
            <li key={record.time}>
              {record.time.getHours()}:{record.time.getMinutes()}:
              {record.time.getSeconds()}: {record.text}
            </li>
          ))}
          <li>
            {currentTime.getHours()}:{currentTime.getMinutes()}:
            {currentTime.getSeconds()}: {transcript}
          </li>
        </ul>
      </Box>
    </Paper>
  );
}
