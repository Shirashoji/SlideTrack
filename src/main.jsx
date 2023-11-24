import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Root from "./routes/Root";
import Upload from "./routes/Upload";
import Record from "./routes/Record";
import Dictaphone from "./routes/RecordOnly";
import Navigation from "./components/Navigation";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/new",
    element: <Upload />,
  },
  {
    path: "/upload",
    element: <Upload />,
  },
  {
    path: "/record/",
    element: <Record />,
  },
  {
    path: "/record/:id",
    element: <Record />,
  },
  {
    path: "/record_only",
    element: <Dictaphone />,
  },
]);

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#388e3c",
      },
      secondary: {
        main: "#ffa000",
      },
      background: {
        default: "#e8f5e9",
      },
    },
  }),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Navigation>
        <RouterProvider router={router} />
      </Navigation>
    </ThemeProvider>
  </React.StrictMode>,
);
