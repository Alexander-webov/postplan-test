import { type APIRequestContext } from "playwright/test";

export class JsonPlaceholderApi {
  request: APIRequestContext;
  baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request; // запомнили request
    this.baseUrl = baseUrl; // запомнили baseUrl
  }

  async getTodo(id: number) {
    // get(our URL)
    return this.request.get(`${this.baseUrl}/todos/${id}`);
  }
  async getTodos() {
    return this.request.get(`${this.baseUrl}/todos`);
  }

  async createPost(data: { title: string; body: string; userId: number }) {
    //post(1 - URL 2 - our new object/data)
    return this.request.post(`${this.baseUrl}/posts`, { data });
  }

  async deletePost(id: number) {
    //delete(url post для удаления)
    return this.request.delete(`${this.baseUrl}/posts/${id}`);
  }
}
