import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import GlobalLayout from "./layouts/GlobalLayout.jsx";
import NotFound from './pages/404.jsx';

import unformattedRoutes from '~react-pages'

import "./index.css";

export const routes = [
  {
    path: '/',
    element: <GlobalLayout />,
    ErrorBoundary: NotFound,
    children: unformattedRoutes,
  }
]

const router = createBrowserRouter(routes);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
