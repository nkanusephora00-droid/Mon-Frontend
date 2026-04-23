import axios from "axios";

const API_URL = "https://mon-backend-rrb8.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error.message);
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/token", { username, password });
    return response.data;
  },
  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => (await api.get("/users")).data,
  getById: async (id: number) => (await api.get(`/users/${id}`)).data,
  create: async (data: any) => (await api.post("/users", data)).data,
  update: async (id: number, data: any) => (await api.put(`/users/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/users/${id}`)).data,
};

// Profile API
export const profileAPI = {
  getMe: async () => (await api.get("/users/me")).data,
  updateMe: async (data: any) => (await api.put("/users/me", data)).data,
  changePassword: async (oldPassword: string, newPassword: string) => 
    (await api.put("/users/me/password", { oldPassword, newPassword })).data,
};

// Applications API
export const applicationsAPI = {
  getAll: async () => (await api.get("/applications")).data,
  getById: async (id: number) => (await api.get(`/applications/${id}`)).data,
  create: async (data: any) => (await api.post("/applications", data)).data,
  update: async (id: number, data: any) => (await api.put(`/applications/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/applications/${id}`)).data,
};

// Comptes API
export const comptesAPI = {
  getAll: async () => (await api.get("/comptes")).data,
  getById: async (id: number) => (await api.get(`/comptes/${id}`)).data,
  create: async (data: any) => (await api.post("/comptes", data)).data,
  update: async (id: number, data: any) => (await api.put(`/comptes/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/comptes/${id}`)).data,
};

// Tests API
export const testsAPI = {
  getAll: async (sessionId?: number) => {
    const params = sessionId ? { sessionId } : {};
    return (await api.get("/tests", { params })).data;
  },
  create: async (data: any) => (await api.post("/tests", data)).data,
  update: async (id: number, data: any) => (await api.put(`/tests/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/tests/${id}`)).data,
};

// Test Sessions API
export const testSessionsAPI = {
  getAll: async () => (await api.get("/test-sessions")).data,
  create: async (data: any) => (await api.post("/test-sessions", data)).data,
  update: async (id: number, data: any) => (await api.put(`/test-sessions/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/test-sessions/${id}`)).data,
};

// Todos API
export const todosAPI = {
  getAll: async () => (await api.get("/todos")).data,
  getById: async (id: number) => (await api.get(`/todos/${id}`)).data,
  create: async (data: any) => (await api.post("/todos", data)).data,
  update: async (id: number, data: any) => (await api.put(`/todos/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/todos/${id}`)).data,
  toggle: async (id: number) => (await api.patch(`/todos/${id}/toggle`)).data,
};

export default api;