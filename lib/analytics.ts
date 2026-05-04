"use client";

export type AnalyticsEvent =
  | { name: "station_view"; stationId: string; stationName: string }
  | { name: "map_click"; stationId: string }
  | { name: "map_zoom"; zoomLevel: number }
  | { name: "chart_view"; chartType: "line" | "bar" | "pie" }
  | { name: "filter_apply"; filterName: string; filterValue: string }
  | { name: "data_export"; format: string };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function getGaMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
}

export function trackEvent(event: AnalyticsEvent): void {
  const { name, ...params } = event;

  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[Analytics]", name, params);
  }
}

export function trackPageView(url: string): void {
  if (typeof window === "undefined") return;

  const measurementId = getGaMeasurementId();

  if (typeof window.gtag === "function" && measurementId) {
    window.gtag("config", measurementId, { page_path: url });
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[Analytics] page_view", { url });
  }
}

export function getSessionStartTime(): number {
  if (typeof window === "undefined") return Date.now();
  const stored = sessionStorage.getItem("eco_session_start");
  if (stored) return Number(stored);
  const now = Date.now();
  sessionStorage.setItem("eco_session_start", String(now));
  return now;
}

export function getSessionDuration(): number {
  return Math.round((Date.now() - getSessionStartTime()) / 1000);
}
