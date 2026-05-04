import { NextRequest, NextResponse } from "next/server";

function log(level: "INFO" | "WARN" | "ERROR", data: Record<string, unknown>) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: "ecomonitor",
    ...data,
  });
  if (level === "ERROR") {
    console.error(entry);
  } else if (level === "WARN") {
    console.warn(entry);
  } else {
    console.log(entry);
  }
}

export function middleware(request: NextRequest) {
  const start = Date.now();
  const { pathname, search } = request.nextUrl;
  const method = request.method;
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const response = NextResponse.next();

  const duration = Date.now() - start;
  const status = response.status;

  const level = status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO";

  log(level, {
    msg: `${method} ${pathname}`,
    method,
    path: pathname,
    query: search || undefined,
    status,
    duration_ms: duration,
    ip,
    userAgent,
  });

  response.headers.set("X-Response-Time", `${duration}ms`);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
