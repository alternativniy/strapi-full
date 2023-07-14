import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import Education from "./pages/education/index.jsx";
import NotFound from "./pages/404.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    ErrorBoundary: NotFound,
  },
  {
    path: "/education",
    element: <AuthLayout />,
    ErrorBoundary: NotFound,
    children: [
      {
        path: "/education",
        element: <Education />,
        index: true,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
