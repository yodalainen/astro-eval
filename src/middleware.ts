import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  console.log("url.pathname", url.pathname);
  
  // 0. Exclude the root path from Basic Auth
  if (url.pathname === "/" || url.pathname === "") {
    return next();
  }

  // 1. Get the Authorization header from the request
  const authHeader = context.request.headers.get("Authorization");

  if (authHeader) {
    // 2. The header is in the format "Basic base64(username:password)"
    try {
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = atob(base64Credentials);
      const [username, password] = credentials.split(":");

      // 3. Check hardcoded credentials
      if (username === "test" && password === "test") {
        return next(); // Credentials match, allow the request
      }
    } catch (e) {
      // Handle malformed headers
    }
  }

  // 4. If no valid credentials, return 401 Unauthorized
  // This triggers the browser's native login popup
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Astro Protected Area"',
    },
  });
});
