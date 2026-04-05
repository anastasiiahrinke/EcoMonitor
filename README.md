# Лабораторна робота №1

**Тема:** Створення проєкту на TypeScript, Next.js та Node.js (SSR)

**Мета:** Набути практичних навичок створення веб-додатку з використанням Next.js та TypeScript, налаштування серверного рендерингу та розробки API для роботи з екологічними даними.

---

## 1. Структура проєкту

```
lab1/
├── app/                        # Сторінки та маршрутизація (App Router)
│   ├── layout.tsx              # Головний layout з навігацією та футером
│   ├── page.tsx                # Головна сторінка (SSR) — список станцій
│   ├── globals.css             # Глобальні стилі
│   ├── station/[id]/page.tsx   # Детальна сторінка станції (SSR, динамічний роутинг)
│   ├── about/page.tsx          # Сторінка "Про проєкт" (SSG)
│   ├── pollutants/page.tsx     # Довідник забруднювачів (SSG)
│   └── api/                    # API Routes
│       ├── stations/route.ts       # GET /api/stations — список станцій
│       ├── stations/[id]/route.ts  # GET /api/stations/:id — дані станції
│       ├── measurements/route.ts   # GET /api/measurements — вимірювання
│       └── current/route.ts        # GET /api/current — поточні показники
├── types/
│   └── index.ts                # TypeScript інтерфейси та типи
├── data/
│   ├── stations.ts             # Тестові дані станцій (7 станцій)
│   └── measurements.ts         # Генерація часових рядів вимірювань
├── lib/
│   └── utils.ts                # Допоміжні функції (AQI, середні значення)
├── components/                 # Каталог для компонентів
├── tsconfig.json               # Конфігурація TypeScript (strict mode)
├── next.config.ts              # Конфігурація Next.js
└── package.json
```

---

## 2. TypeScript інтерфейси

Усі інтерфейси описані у файлі `types/index.ts`:

### AirQualityData
Дані про якість повітря — концентрації забруднювачів:
```typescript
export interface AirQualityData {
  pm25: number;    // PM2.5, мкг/м³
  pm10: number;    // PM10, мкг/м³
  no2: number;     // Діоксид азоту, мкг/м³
  so2: number;     // Діоксид сірки, мкг/м³
  co: number;      // Чадний газ, мг/м³
  o3: number;      // Озон, мкг/м³
  aqi: number;     // Індекс якості повітря
}
```

### MonitoringStation
Інформація про моніторингову станцію:
```typescript
export interface MonitoringStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: "industrial" | "urban" | "suburban" | "rural" | "traffic";
  address: string;
  active: boolean;
}
```

### Measurement
Часові ряди вимірювань:
```typescript
export interface Measurement {
  id: string;
  stationId: string;
  date: string;       // формат YYYY-MM-DD
  time: string;       // формат HH:MM
  airQuality: AirQualityData;
}
```

### API типи
Структура запитів, відповідей та помилок:
```typescript
export interface StationsRequest {
  type?: MonitoringStation["type"];
  active?: boolean;
}

export interface MeasurementsRequest {
  stationId: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof AirQualityData;
  sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string };
  timestamp: string;
}
```

---

## 3. Сторінки з SSR та SSG

### Головна сторінка (SSR) — `app/page.tsx`
- `export const dynamic = "force-dynamic"` — забезпечує серверний рендеринг при кожному запиті
- Відображає загальну статистику (кількість станцій, вимірювань, середній AQI)
- Виводить картки всіх станцій з поточними показниками AQI
- Має навігацію до детальних сторінок

### Сторінка станції (SSR) — `app/station/[id]/page.tsx`
- Динамічний роутинг через `[id]`
- SSR — дані завантажуються на сервері при кожному запиті
- Відображає: інформацію про станцію, останнє вимірювання, графік середніх показників (bar chart), таблицю останніх 10 вимірювань

### Сторінка "Про проєкт" (SSG) — `app/about/page.tsx`
- Статична генерація при збірці
- Інформація про проєкт, технології, функціональність, шкалу AQI

### Довідник забруднювачів (SSG) — `app/pollutants/page.tsx`
- Статична генерація при збірці
- Довідкова інформація про кожний забруднювач: опис, одиниці виміру, норми ВООЗ та України

---

## 4. API — приклади запитів та відповідей

### GET /api/stations
Отримання списку станцій з фільтрацією за типом та статусом.

**Запит:** `GET /api/stations?type=urban&active=true`

**Відповідь:**
```json
{
  "success": true,
  "data": [
    {
      "id": "station-1",
      "name": "Хрещатик",
      "latitude": 50.4501,
      "longitude": 30.5234,
      "type": "urban",
      "address": "вул. Хрещатик, 1, Київ",
      "active": true
    }
  ],
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

### GET /api/stations/:id
Детальна інформація про станцію з останнім вимірюванням.

**Запит:** `GET /api/stations/station-1`

**Відповідь:**
```json
{
  "success": true,
  "data": {
    "station": { "id": "station-1", "name": "Хрещатик", "..." : "..." },
    "latestMeasurement": { "pm25": 32.5, "pm10": 48.2, "no2": 38.1, "so2": 11.4, "co": 0.72, "o3": 42.8, "aqi": 65 },
    "averageToday": null
  },
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

### GET /api/measurements
Вимірювання з фільтрацією, сортуванням та пагінацією.

**Запит:** `GET /api/measurements?stationId=station-1&startDate=2026-03-28&endDate=2026-04-01&page=1&limit=5&sortBy=aqi&sortOrder=desc`

**Відповідь:**
```json
{
  "success": true,
  "data": [ { "id": "station-1-2026-04-01-00", "stationId": "station-1", "date": "2026-04-01", "time": "00:00", "airQuality": { "..." : "..." } } ],
  "page": 1,
  "limit": 5,
  "total": 28,
  "totalPages": 6,
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

### GET /api/current
Поточні показники всіх активних станцій.

**Запит:** `GET /api/current`

**Відповідь:**
```json
{
  "success": true,
  "data": [
    {
      "station": { "id": "station-1", "name": "Хрещатик", "..." : "..." },
      "current": { "pm25": 32.5, "pm10": 48.2, "no2": 38.1, "so2": 11.4, "co": 0.72, "o3": 42.8, "aqi": 65 },
      "measuredAt": "2026-04-01T00:00"
    }
  ],
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

### Обробка помилок
```json
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "Станцію з id \"station-999\" не знайдено" },
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

---

## 5. Ключові фрагменти коду

### Строга конфігурація TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```
Це забезпечує максимальну перевірку типів на етапі компіляції.

### Головний layout (`app/layout.tsx`)
```tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>
        <nav className="nav">
          <Link href="/" className="nav-logo">EcoMonitor</Link>
          <ul className="nav-links">
            <li><Link href="/">Станції</Link></li>
            <li><Link href="/about">Про проєкт</Link></li>
            <li><Link href="/pollutants">Забруднювачі</Link></li>
          </ul>
        </nav>
        {children}
        <footer className="footer">© 2026 EcoMonitor</footer>
      </body>
    </html>
  );
}
```

### SSR з force-dynamic (`app/page.tsx`)
```tsx
export const dynamic = "force-dynamic"; // Примусовий SSR при кожному запиті

export default async function HomePage() {
  const activeStations = stations.filter((s) => s.active);
  const overallAvg = calculateAverage(allMeasurementsFlat);
  // ... рендеринг даних на сервері
}
```

### API з валідацією та пагінацією (`app/api/measurements/route.ts`)
```tsx
export async function GET(request: NextRequest) {
  const stationId = searchParams.get("stationId");
  if (!stationId) {
    return NextResponse.json({ success: false, error: { code: "MISSING_PARAM", message: "..." } }, { status: 400 });
  }
  // Фільтрація за датою, сортування, пагінація
  const paged = filtered.slice(start, start + limit);
  return NextResponse.json({ success: true, data: paged, page, limit, total, totalPages, timestamp });
}
```

### Дженерик для API відповідей (`types/index.ts`)
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

---

## 6. Відповіді на контрольні питання

### 1. Переваги серверного рендерингу для додатків з науковими даними
SSR забезпечує: швидше відображення першого контенту (FCP), оскільки HTML генерується на сервері; кращу індексацію пошуковими системами; можливість обробки великих обсягів даних на сервері без навантаження на клієнт; актуальність даних при кожному запиті, що критично для моніторингу в реальному часі.

### 2. TypeScript та надійність коду при роботі з екологічними даними
TypeScript забезпечує: статичну перевірку типів — помилки виявляються на етапі компіляції; автодоповнення та документацію через інтерфейси; гарантію структури даних (AirQualityData, Measurement) на всіх рівнях додатку; типобезпечні дженерики для API-відповідей (ApiResponse<T>), що виключають неправильну обробку даних.

### 3. Коли використовувати SSR, SSG та ISR
- **SSR** — для даних, що змінюються часто: головна сторінка з поточними показниками, сторінка конкретної станції з останніми вимірюваннями.
- **SSG** — для сторінок зі сталим контентом: довідник забруднювачів, сторінка "Про проєкт".
- **ISR** (Incremental Static Regeneration) — для сторінок, де дані оновлюються періодично: щоденні звіти, агреговані дані за тиждень (revalidate кожних N секунд).

### 4. Принципи організації API для масштабованості
- RESTful архітектура з чіткими ендпоінтами (/api/stations, /api/measurements)
- Валідація вхідних параметрів на рівні API
- Пагінація для великих наборів даних (page, limit, total, totalPages)
- Фільтрація та сортування через query-параметри
- Стандартизовані формати відповідей (ApiResponse<T>) та помилок (ApiError)
- Розділення відповідальності: окремі ендпоінти для різних ресурсів

### 5. Типобезпечна взаємодія між клієнтом та сервером
- Спільні TypeScript інтерфейси в каталозі `types/` використовуються як на сервері (API routes), так і на клієнті (сторінки)
- Дженерики (ApiResponse<T>, PaginatedResponse<T>) гарантують відповідність структури відповіді очікуваному типу
- Строгий режим TypeScript (`strict: true`, `noUncheckedIndexedAccess`) не дозволяє ігнорувати невизначені значення
- Інтерфейси запитів (StationsRequest, MeasurementsRequest) описують допустимі параметри

---

## 7. Висновки

У ході лабораторної роботи було створено веб-додаток EcoMonitor для моніторингу якості повітря з використанням Next.js (App Router) та TypeScript. Реалізовано:

- Серверний рендеринг (SSR) для головної сторінки та сторінки станції з динамічним роутингом
- Статичну генерацію (SSG) для інформаційних сторінок
- 4 API ендпоінти з валідацією, фільтрацією, сортуванням та пагінацією
- Строгу типізацію усіх даних через TypeScript інтерфейси та дженерики
- Тестові дані для 7 моніторингових станцій з реалістичними часовими рядами
- Глобальні CSS стилі та адаптивний layout з навігацією

Проєкт демонструє переваги SSR для роботи з науковими даними та ефективність TypeScript для забезпечення надійності структурованих екологічних даних.
