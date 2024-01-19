import PropTypes from "prop-types";
import Box from "@mui/system/Box";
import Link from "@mui/material/Link";
import { Paper } from "@mui/material";

export default function TranscriptionView(props) {
  const { records, transcript, setPage } = props;

  TranscriptionView.propTypes = {
    records: PropTypes.array.isRequired,
    transcript: PropTypes.string.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  const currentTime = new Date(Date.now());
  return (
    <Paper sx={{ overflowY: "scroll" }}>
      <Box sx={{ flexGrow: 1 }} minWidth={{ md: "90vw", lg: "35vw" }}>
        <ul>
          {records.map((record) => (
            <li key={record.time}>
              <Link
                onClick={() => {
                  setPage(record.page);
                }}
              >
                {record.time.getHours()}:{record.time.getMinutes()}:
                {record.time.getSeconds()}:
              </Link>
              {record.text}
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
