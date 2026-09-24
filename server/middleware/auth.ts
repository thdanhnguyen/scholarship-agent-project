import { runAuthGuard } from "@agent-native/core/server";
/**
 * Global auth middleware — runs for ALL requests (page routes, API routes,
 * framework routes). The auth plugin configures the guard; this middleware
 * enforces it on every request.
 *
 * Without this, auth only runs for /_agent-native/* routes because the
 * framework handler's middleware registry is scoped to that catch-all.
 * Page routes (/, /settings) and API routes (/api/*) would bypass auth.
 */
import { defineEventHandler, getHeader, getRequestURL, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  const acceptsHtml = getHeader(event, "accept")?.includes("text/html");

  // The public product has only two screens. Legacy template pages are not
  // exposed as login destinations; direct visits return to the landing page.
  if (
    event.method === "GET" &&
    acceptsHtml &&
    path !== "/" &&
    path !== "/discover" &&
    !path.startsWith("/_agent-native/")
  ) {
    return sendRedirect(event, "/", 302);
  }

  return runAuthGuard(event);
});
