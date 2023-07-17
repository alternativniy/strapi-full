import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import StartupLayout from "./layouts/StartupLayout";

import routes from "./routes";

const router = createBrowserRouter(routes);

if(window.strapiFullStaticPage) {
  ReactDOM.hydrateRoot(
    document.getElementById("root"),
    <StartupLayout>
      <RouterProvider router={router} />
    </StartupLayout>,    
  );
}
else {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <StartupLayout>
      <RouterProvider router={router} />
    </StartupLayout>,
  );
}

