export default function AboutPage() {
  return (
    <div className="container">
      <h1 className="page-title">Про проєкт</h1>

      <div className="info-section">
        <h2>EcoMonitor</h2>
        <p>
          EcoMonitor — це веб-додаток для моніторингу якості повітря в режимі реального часу.
          Система збирає дані з мережі моніторингових станцій та надає зручний інтерфейс
          для перегляду екологічних показників.
        </p>
      </div>

      <div className="info-section">
        <h2>Технології</h2>
        <ul>
          <li><strong>Next.js</strong> — фреймворк для React з підтримкою SSR та SSG</li>
          <li><strong>TypeScript</strong> — типізована надбудова над JavaScript</li>
          <li><strong>App Router</strong> — сучасна система маршрутизації Next.js</li>
          <li><strong>API Routes</strong> — серверні ендпоінти для роботи з даними</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Функціональність</h2>
        <ul>
          <li>Перегляд списку моніторингових станцій</li>
          <li>Детальна інформація про кожну станцію</li>
          <li>Поточні показники якості повітря</li>
          <li>Часові ряди вимірювань</li>
          <li>Графічне представлення даних</li>
          <li>API для отримання даних з фільтрацією, сортуванням та пагінацією</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Індекс якості повітря (AQI)</h2>
        <p>AQI — це числовий показник, що характеризує загальний рівень забруднення повітря:</p>
        <ul>
          <li><strong>0–50</strong> — Добре. Якість повітря задовільна.</li>
          <li><strong>51–100</strong> — Помірно. Прийнятна якість повітря.</li>
          <li><strong>101–150</strong> — Шкідливо для чутливих груп населення.</li>
          <li><strong>151–200</strong> — Шкідливо. Загальний вплив на здоров&apos;я.</li>
          <li><strong>201+</strong> — Дуже шкідливо. Надзвичайні умови.</li>
        </ul>
      </div>
    </div>
  );
}
