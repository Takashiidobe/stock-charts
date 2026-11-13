import { defineConfig } from "vite";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { handler } = require("./netlify/functions/chart.js");

function netlifyFunctionDevMiddleware() {
  return {
    name: "netlify-function-dev-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = new URL(req.url, "http://localhost");
        if (requestUrl.pathname !== "/.netlify/functions/chart") return next();

        try {
          const result = await handler({
            httpMethod: req.method,
            queryStringParameters: Object.fromEntries(requestUrl.searchParams),
          });
          res.statusCode = result.statusCode;
          for (const [name, value] of Object.entries(result.headers || {})) {
            res.setHeader(name, value);
          }
          res.end(result.body);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig({
  root: "src",
  plugins: [netlifyFunctionDevMiddleware()],
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
});
