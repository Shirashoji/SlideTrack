import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Root from "./routes/root";
import Upload from "./routes/upload";
import Record from "./routes/record";
import Dictaphone from "./routes/speechToTextSample";
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
    path: "/record_sample",
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
