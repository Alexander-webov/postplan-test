import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

export default defineConfig({
  // Где лежат тесты. Относительно корня проекта.
  testDir: "./tests",

  // Запускаем тесты параллельно внутри одного файла.
  // По умолчанию параллелятся только разные файлы.
  // fullyParallel: true даёт максимум скорости, но требует,
  // чтобы тесты были полностью изолированы (не делили данные).
  fullyParallel: true,

  // Защита от случайного `test.only` в проде.
  // Если кто-то закоммитит `test.only`, CI упадёт.
  forbidOnly: !!process.env.CI,

  // Повторы. На CI 2 раза, локально не повторяем — чтобы видеть реальные падения.
  // ВАЖНО: ретраи маскируют флаки. Они нужны как страховка, не как костыль.
  retries: process.env.CI ? 2 : 0,

  // Воркеры. Сколько параллельных процессов запускать.
  // undefined = по числу ядер CPU. На CI обычно ограничивают, чтобы не сожрать ресурсы.
  workers: process.env.CI ? 2 : undefined,

  // Репортеры. list — в консоль. html — красивый отчёт.
  // На CI обычно ещё github (аннотации в PR) или junit для интеграций.
  reporter: [
    ["list"],
    ["html", { open: "never" }], // open: 'never' — не открывать автоматически
  ],

  // Настройки, применяемые ко ВСЕМ тестам.
  use: {
    // Базовый URL. Все page.goto('/login') резолвятся относительно него.
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // Скрин при падении.
    screenshot: "only-on-failure",

    // Видео — только при падении. Иначе диск переполнится.
    video: "retain-on-failure",

    // Trace — полная запись действий, сети, DOM. Бесценно для дебага.
    // 'on-first-retry' = только при первом ретрае. Экономит место.
    trace: "on-first-retry",

    // Тайм-аут на действия (click, fill и т.д.). По умолчанию 0 (без лимита).
    // 10 секунд — нормальный потолок.
    actionTimeout: 10_000,

    // Тайм-аут на загрузку страницы.
    navigationTimeout: 15_000,
  },

  // Проекты — это разные конфигурации запуска одних и тех же тестов.
  // Можно гонять одни и те же тесты в Chrome и Firefox.
  // Или разделять setup-тесты и обычные (мы это сделаем позже).
  projects: [
    // 1. Setup project — запускается первым, логинится, сохраняет state.
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/, // регексп: запускать только файлы *.setup.ts
    },

    // 2. Основной project — зависит от setup, использует сохранённое состояние.
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Каждый тест в этом проекте стартует с этой сессией.
        // Playwright подгружает куки/localStorage из файла перед каждым тестом.
        storageState: "playwright/.auth/user.json",
      },
      // dependencies — массив имён проектов, которые ДОЛЖНЫ пройти успешно
      // ДО того как стартует этот проект.
      dependencies: ["setup"],
    },
  ],

  // Автозапуск dev-сервера перед тестами.
  // Если уже запущен на 3000 — переиспользует. Если нет — поднимет.
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // Next.js на холодном старте долго билдится
  },
});
