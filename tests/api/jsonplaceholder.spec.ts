import { test, expect } from "@playwright/test";

// baseURL для удобства — все запросы пойдут на эту базу
const BASE = "https://jsonplaceholder.typicode.com";

test.describe("JSONPlaceholder API — тренировка", () => {
  test("GET 1 todo - return status 200", async ({ request }) => {
    // пофакту мы делаем вот такой запрос https://jsonplaceholder.typicode.com/todos/1
    //и конечно же ожидаем результат ввиде объекта с данными
    const response = await request.get(`${BASE}/todos/1`);

    // Обязательно проверяем статус ссылки т.е. response должен вернуть 200 (ok) Проверяем статус
    expect(response.status()).toBe(200);

    // Парсим тело ответа как JSON / преобразуем в читабельный вид и получаем данные с запроса response

    const body = await response.json();

    // Проверяем структуру — какие поля должны быть

    expect(body).toHaveProperty("userId");
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("title");
    expect(body).toHaveProperty("completed");

    // Проверяем конкретные значения
    expect(body.id).toBe(1);
    expect(typeof body.title).toBe("string");
    expect(typeof body.completed).toBe("boolean");
  });
});
test("GET несуществующий todo — возвращает 404", async ({ request }) => {
  const response = await request.get(`${BASE}/todos/99999`);

  expect(response.status()).toBe(404);
});

test("POST создание поста — возвращает 201 и созданный объект", async ({ request }) => {
  // Body POST-запроса — это данные, которые мы посылаем
  const newPost = {
    title: "Мой первый AQA-тест",
    body: "Тренируюсь на JSONPlaceholder",
    userId: 1,
  };

  const response = await request.post(`${BASE}/posts`, {
    data: newPost, // data — это body запроса в формате JSON
  });

  // 201 Created — стандартный статус для POST, который что-то создал
  expect(response.status()).toBe(201);

  const body = await response.json();

  // JSONPlaceholder возвращает наш объект + сгенерированный id
  expect(body).toMatchObject({
    title: "Мой первый AQA-тест",
    body: "Тренируюсь на JSONPlaceholder",
    userId: 1,
  });
  expect(body.id).toBeDefined();
});

test("PUT обновление поста — возвращает 200", async ({ request }) => {
  const response = await request.put(`${BASE}/posts/1`, {
    data: {
      id: 1,
      title: "обновлённый заголовок",
      body: "обновлённое тело",
      userId: 1,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.title).toBe("обновлённый заголовок");
});

test("DELETE поста — возвращает 200", async ({ request }) => {
  const response = await request.delete(`${BASE}/posts/1`);

  expect(response.status()).toBe(200);
});

test("GET с query параметрами — комменты к посту 1", async ({ request }) => {
  // Query parameters передаются через объект params.
  // Playwright сам склеит их в URL как ?postId=1
  const response = await request.get(`${BASE}/comments`, {
    params: { postId: 1 },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);

  // Все комменты в ответе должны принадлежать посту 1
  for (const comment of body) {
    expect(comment.postId).toBe(1);
  }
});

test("GET вложенного ресурса — комменты через /posts/1/comments", async ({ request }) => {
  // Тот же результат можно получить через nested route.
  // Это два разных стиля REST API — оба валидны.
  const response = await request.get(`${BASE}/posts/1/comments`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.length).toBeGreaterThan(0);
  expect(body[0].postId).toBe(1);
});
