import { useMemo } from "react";
import { useLocation, matchRoutes } from "react-router"

import routes from "../routes";

export default function useRoute() {
  const location = useLocation();
  const route = useMemo(() => {
    const matched = matchRoutes(routes, location);
    const last = matched.pop();

    last.route.base = last.pathnameBase;

    return last.route;
  }, [location]);


  return route;
}