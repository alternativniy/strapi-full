import ReactDOMServer from 'react-dom/server';
import { matchRoutes } from 'react-router';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";

import StartupLayout from './layouts/StartupLayout';

import routes from './routes';

export async function SSRRender(url) {
  let { dataRoutes } = createStaticHandler(routes);
  const context = { location: url, matches: matchRoutes(routes, url) ?? [] };

  let router = createStaticRouter(dataRoutes, context);

  return ReactDOMServer.renderToString(
    <StartupLayout>
      <StaticRouterProvider
        router={router}
        context={context}
      />
    </StartupLayout>
  );
}
