"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        service: "ecomonitor",
        msg: "Unhandled page error",
        error: error.message,
        digest: error.digest,
      })
    );
  }, [error]);

  return (
    <div className="container error-page">
      <div className="error-page-code">500</div>
      <h1 className="error-page-title">Помилка сервера</h1>
      <p className="error-page-text">
        Виникла непередбачена помилка. Ми вже знаємо про неї і працюємо над виправленням.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button className="btn" onClick={reset}>
          Спробувати ще раз
        </button>
        <Link href="/" className="btn">
          На головну
        </Link>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="error-boundary-detail">{error.message}</pre>
      )}
    </div>
  );
}
