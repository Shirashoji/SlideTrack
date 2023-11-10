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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Navigation>
      <RouterProvider router={router} />
    </Navigation>
  </React.StrictMode>,
);
