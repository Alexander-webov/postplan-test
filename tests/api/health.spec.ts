import { test, expect } from "@playwright/test";

test.describe("Health API", () => {
  test("GET /api/health return 200 and correct payload @smoke", async ({ request }) => {
    const response = await request.get("api/health");

    //check status
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    //parce JSON
    const body = await response.json();

    //check response
    expect(body).toMatchObject({
      ok: true,
      service: "postplan",
    });
    // timestamp должен быть валидной ISO-строкой
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test("HEAD /api/health return 200", async ({ request }) => {
    const response = await request.get("/api/health");

    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toContain("no-store");
  });
});
