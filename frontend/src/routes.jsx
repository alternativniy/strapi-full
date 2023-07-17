import GlobalLayout from "./layouts/GlobalLayout.jsx";
import NotFound from './pages/_404.jsx';

import unformattedRoutes from '~react-pages'

const routes = [
  {
    path: '/',
    element: <GlobalLayout />,
    ErrorBoundary: NotFound,
    children: unformattedRoutes,
  }
];

export default routes;