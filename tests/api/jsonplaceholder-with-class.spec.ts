import { test, expect } from "@playwright/test";
import { JsonPlaceholderApi } from "./services/jsonplaceholder.api";
import { AwardIcon } from "lucide-react";

test.describe("JSONPlaceholder через класс", () => {
  test("GET одного todo", async ({ request }) => {
    // Создаём ЭКЗЕМПЛЯР класса. new вызывает конструктор.
    // Передаём то, что класс попросит запомнить.
    const api = new JsonPlaceholderApi(request, "https://jsonplaceholder.typicode.com");
    // Теперь вызываем метод. URL и request передавать не нужно — они уже внутри.
    const response = await api.getTodo(1);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
  });

  test("POST создание поста", async ({ request }) => {
    const api = new JsonPlaceholderApi(request, "https://jsonplaceholder.typicode.com");
    //сразу отправляем наш новый пост и кладем результат в переменную
    const response = await api.createPost({
      title: "Через класс",
      body: "Стало чище",
      userId: 1,
    });
    //проверяем
    expect(response.status()).toBe(201);
    //вытаскиваем данные
    const body = await response.json();
    //проверяем тайтл
    expect(body.title).toBe("Через класс");
  });

  test("DELETE поста", async ({ request }) => {
    const api = new JsonPlaceholderApi(request, "https://jsonplaceholder.typicode.com");
    const response = await api.deletePost(1);
    expect(response.status()).toBe(200);
  });
});
