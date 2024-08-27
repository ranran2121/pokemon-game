import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Home from "./routes/Home";
import PlayPage from "./routes/PlayPage";
import Root from "./routes/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/play",
        element: <PlayPage />,
      },
    ],
  },
]);

export default router;
