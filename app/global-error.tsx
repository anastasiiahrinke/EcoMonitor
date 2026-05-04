"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        service: "ecomonitor",
        msg: "Global unhandled error",
        error: error.message,
        digest: error.digest,
      })
    );
  }, [error]);

  return (
    <html lang="uk">
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Критична помилка</h1>
          <p>Додаток зіткнувся з критичною помилкою.</p>
          <button onClick={reset}>Перезавантажити</button>
        </div>
      </body>
    </html>
  );
}
