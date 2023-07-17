// src/utils.ts
import { win32 } from "path";

// src/constants.ts
var ROUTE_IMPORT_NAME = "__pages_import_$1__";
var dynamicRouteRE = /^\[(.+)\]$/;
var cacheAllRouteRE = /^\[\.{3}(.*)\]$/;
var replaceDynamicRouteRE = /^\[(?:\.{3})?(.*)\]$/;
var nuxtDynamicRouteRE = /^_(.*)$/;
var nuxtCacheAllRouteRE = /^_$/;
var countSlashRE = /\//g;
var replaceIndexRE = /\/?index$/;

// src/utils.ts
function countSlash(value) {
  return (value.match(countSlashRE) || []).length;
}
function isDynamicRoute(routePath, nuxtStyle = false) {
  return nuxtStyle
    ? nuxtDynamicRouteRE.test(routePath)
    : dynamicRouteRE.test(routePath);
}
function isCatchAllRoute(routePath, nuxtStyle = false) {
  return nuxtStyle
    ? nuxtCacheAllRouteRE.test(routePath)
    : cacheAllRouteRE.test(routePath);
}
function resolveImportMode(filepath, options) {
  const mode = options.importMode;
  if (typeof mode === "function") return mode(filepath, options);
  return mode;
}
function normalizeCase(str, caseSensitive) {
  if (!caseSensitive) return str.toLocaleLowerCase();
  return str;
}
function normalizeName(name, isDynamic, nuxtStyle = false) {
  if (!isDynamic) return name;
  return nuxtStyle
    ? name.replace(nuxtDynamicRouteRE, "$1") || "all"
    : name.replace(replaceDynamicRouteRE, "$1");
}
function buildReactRoutePath(node, nuxtStyle = false) {
  const isDynamic = isDynamicRoute(node, nuxtStyle);
  const isCatchAll = isCatchAllRoute(node, nuxtStyle);
  const normalizedName = normalizeName(node, isDynamic, nuxtStyle);
  if (isDynamic) {
    if (isCatchAll) return "*";
    return `:${normalizedName}`;
  }
  return `${normalizedName}`;
}
function buildReactRemixRoutePath(node) {
  const escapeStart = "[";
  const escapeEnd = "]";
  let result = "";
  let rawSegmentBuffer = "";
  let inEscapeSequence = 0;
  let skipSegment = false;
  for (let i = 0; i < node.length; i++) {
    let isNewEscapeSequence2 = function () {
        return (
          !inEscapeSequence && char === escapeStart && lastChar !== escapeStart
        );
      },
      isCloseEscapeSequence2 = function () {
        return inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd;
      },
      isStartOfLayoutSegment2 = function () {
        return char === "_" && nextChar === "_" && !rawSegmentBuffer;
      };
    var isNewEscapeSequence = isNewEscapeSequence2,
      isCloseEscapeSequence = isCloseEscapeSequence2,
      isStartOfLayoutSegment = isStartOfLayoutSegment2;
    const char = node.charAt(i);
    const lastChar = i > 0 ? node.charAt(i - 1) : void 0;
    const nextChar = i < node.length - 1 ? node.charAt(i + 1) : void 0;
    if (skipSegment) {
      if (char === "/" || char === "." || char === win32.sep)
        skipSegment = false;
      continue;
    }
    if (isNewEscapeSequence2()) {
      inEscapeSequence++;
      continue;
    }
    if (isCloseEscapeSequence2()) {
      inEscapeSequence--;
      continue;
    }
    if (inEscapeSequence) {
      result += char;
      continue;
    }
    if (char === "/" || char === win32.sep || char === ".") {
      if (rawSegmentBuffer === "index" && result.endsWith("index"))
        result = result.replace(replaceIndexRE, "");
      else result += "/";
      rawSegmentBuffer = "";
      continue;
    }
    if (isStartOfLayoutSegment2()) {
      skipSegment = true;
      continue;
    }
    rawSegmentBuffer += char;
    if (char === "$") {
      result += typeof nextChar === "undefined" ? "*" : ":";
      continue;
    }
    result += char;
  }
  if (rawSegmentBuffer === "index" && result.endsWith("index"))
    result = result.replace(replaceIndexRE, "");
  return result || void 0;
}

// src/stringify.ts
var componentRE = /"(?:component|element)":("(.*?)")/g;
var hasFunctionRE = /"(?:props|beforeEnter)":("(.*?)")/g;
var multilineCommentsRE = /\/\*(.|[\r\n])*?\*\//gm;
var singlelineCommentsRE = /\/\/.*/g;
function replaceFunction(_, value) {
  if (value instanceof Function || typeof value === "function") {
    const fnBody = value
      .toString()
      .replace(multilineCommentsRE, "")
      .replace(singlelineCommentsRE, "")
      .replace(/(\t|\n|\r|\s)/g, "");
    if (fnBody.length < 8 || fnBody.substring(0, 8) !== "function")
      return `_NuFrRa_${fnBody}`;
    return fnBody;
  }
  return value;
}
function stringifyRoutes(preparedRoutes, options) {
  const importsMap = /* @__PURE__ */ new Map();
  function getImportString(path, importName) {
    var _a, _b;
    const mode = resolveImportMode(path, options);
    return mode === "sync" || path.includes(".static.")
      ? `import ${importName} from "${path}"`
      : `const ${importName} = ${
          ((_b =
            (_a = options.resolver.stringify) == null
              ? void 0
              : _a.dynamicImport) == null
            ? void 0
            : _b.call(_a, path)) || `() => import("${path}")`
        }`;
  }
  function componentReplacer(str, replaceStr, path) {
    var _a, _b;
    let importName = importsMap.get(path);
    if (!importName)
      importName = ROUTE_IMPORT_NAME.replace("$1", `${importsMap.size}`);
    importsMap.set(path, importName);
    importName =
      ((_b =
        (_a = options.resolver.stringify) == null ? void 0 : _a.component) ==
      null
        ? void 0
        : _b.call(_a, importName)) || importName;
    return str.replace(replaceStr, importName);
  }
  function functionReplacer(str, replaceStr, content) {
    if (content.startsWith("function")) return str.replace(replaceStr, content);
    if (content.startsWith("_NuFrRa_"))
      return str.replace(replaceStr, content.slice(8));
    return str;
  }
  const stringRoutes = JSON.stringify(preparedRoutes, replaceFunction)
    .replace(componentRE, componentReplacer)
    .replace(hasFunctionRE, functionReplacer);
  const imports = Array.from(importsMap).map((args) =>
    getImportString(...args)
  );
  return {
    imports,
    stringRoutes,
  };
}
function generateClientCode(routes, options) {
  var _a, _b;
  const { imports, stringRoutes } = stringifyRoutes(routes, options);
  const code = `${imports.join(";\n")};

const routes = ${stringRoutes};

export default routes;`;
  return (
    ((_b = (_a = options.resolver.stringify) == null ? void 0 : _a.final) ==
    null
      ? void 0
      : _b.call(_a, code)) || code
  );
}

// src/resolvers/react.ts
function prepareRoutes(routes, options, parent) {
  var _a, _b;
  for (const route of routes) {
    if (parent)
      route.path = (_a = route.path) == null ? void 0 : _a.replace(/^\//, "");
    if (route.children)
      route.children = prepareRoutes(route.children, options, route);
    delete route.rawRoute;
    Object.assign(
      route,
      ((_b = options.extendRoute) == null
        ? void 0
        : _b.call(options, route, parent)) || {}
    );
  }
  return routes;
}
async function computeReactRoutes(ctx) {
  var _a, _b;
  const { routeStyle, caseSensitive } = ctx.options;
  const nuxtStyle = routeStyle === "nuxt";
  const pageRoutes = [...ctx.pageRouteMap.values()].sort(
    (a, b) => countSlash(a.route) - countSlash(b.route)
  );
  const routes = [];
  pageRoutes.forEach((page) => {
    const pathNodes = page.route.split("/");
    const element = page.path.replace(ctx.root, "");
    let parentRoutes = routes;
    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i];
      const route = {
        caseSensitive,
        path: "",
        rawRoute: pathNodes.slice(0, i + 1).join("/"),
      };
      if (i === pathNodes.length - 1) route.element = element;
      const isIndexRoute = normalizeCase(node, caseSensitive).endsWith("index");
      if (!route.path && isIndexRoute) {
        route.path = "/";
      } else if (!isIndexRoute) {
        if (routeStyle === "remix") route.path = buildReactRemixRoutePath(node);
        else route.path = buildReactRoutePath(node, nuxtStyle);
      }
      const parent = parentRoutes.find((parent2) => {
        return pathNodes.slice(0, i).join("/") === parent2.rawRoute;
      });
      if (parent) {
        parent.children = parent.children || [];
        parentRoutes = parent.children;
      }
      const exits = parentRoutes.some((parent2) => {
        return pathNodes.slice(0, i + 1).join("/") === parent2.rawRoute;
      });
      if (!exits) parentRoutes.push(route);
    }
  });
  let finalRoutes = prepareRoutes(routes, ctx.options);
  finalRoutes =
    (await ((_b = (_a = ctx.options).onRoutesGenerated) == null
      ? void 0
      : _b.call(_a, finalRoutes))) || finalRoutes;
  return finalRoutes;
}
async function resolveReactRoutes(ctx) {
  var _a, _b;
  const finalRoutes = await computeReactRoutes(ctx);
  let client = generateClientCode(finalRoutes, ctx.options);
  client =
    (await ((_b = (_a = ctx.options).onClientGenerated) == null
      ? void 0
      : _b.call(_a, client))) || client;
  return client;
}
function reactResolver() {
  return {
    resolveModuleIds() {
      return ["~react-pages", "virtual:generated-pages-react"];
    },
    resolveExtensions() {
      return ["tsx", "jsx", "ts", "js"];
    },
    async resolveRoutes(ctx) {
      return resolveReactRoutes(ctx);
    },
    async getComputedRoutes(ctx) {
      return computeReactRoutes(ctx);
    },
    stringify: {
      component: (path) => `React.createElement(${path})`,
      dynamicImport: (path) => `React.lazy(() => import("${path}"))`,
      final: (code) => `import React from "react";
${code}`,
    },
  };
}
export { reactResolver };
