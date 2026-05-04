import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container error-page">
      <div className="error-page-code">404</div>
      <h1 className="error-page-title">Сторінку не знайдено</h1>
      <p className="error-page-text">
        Сторінка, яку ви шукаєте, не існує або була переміщена.
      </p>
      <Link href="/" className="btn">
        На головну
      </Link>
    </div>
  );
}
