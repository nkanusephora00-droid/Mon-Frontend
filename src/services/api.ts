import axios, { AxiosError } from "axios";

const ONLINE_API = "https://itaccess-backend.onrender.com";
const LOCAL_API = "http://localhost:8080";

const createApi = (baseURL: string) => axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

const api = createApi(ONLINE_API);
const localApi = createApi(LOCAL_API);

let useLocal = false;

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

localApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log("API Request (local):", config.method?.toUpperCase(), config.url);
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

// Simple fallback - use online by default
export const getApi = () => {
  if (useLocal) return localApi;
  return api;
};

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const instance = getApi();
    console.log("Login attempt to:", instance.defaults.baseURL);
    try {
      const response = await instance.post("/auth/token", { username, password });
      return response.data;
    } catch (error: any) {
      // Try local if online fails
      if (!useLocal && (error.code === 'ERR_NETWORK' || error.message?.includes('Network'))) {
        console.log("Online failed, trying local...");
        useLocal = true;
        const localResponse = await localApi.post("/auth/token", { username, password });
        return localResponse.data;
      }
      throw error;
    }
  },
  me: async () => {
    const instance = getApi();
    try {
      const response = await instance.get("/auth/me");
      return response.data;
    } catch (error: any) {
      if (!useLocal && (error.code === 'ERR_NETWORK' || error.message?.includes('Network'))) {
        useLocal = true;
        const localResponse = await localApi.get("/auth/me");
        return localResponse.data;
      }
      throw error;
    }
  },
};

// Users API
export const usersAPI = {
  getAll: async () => (await getApi()).get("/users").then(r => r.data),
  getById: async (id: number) => (await getApi()).get(`/users/${id}`).then(r => r.data),
  create: async (data: any) => (await getApi()).post("/users", data).then(r => r.data),
  update: async (id: number, data: any) => (await getApi()).put(`/users/${id}`, data).then(r => r.data),
  delete: async (id: number) => (await getApi()).delete(`/users/${id}`).then(r => r.data),
};

// Applications API
export const applicationsAPI = {
  getAll: async () => (await getApi()).get("/applications").then(r => r.data),
  getById: async (id: number) => (await getApi()).get(`/applications/${id}`).then(r => r.data),
  create: async (data: any) => (await getApi()).post("/applications", data).then(r => r.data),
  update: async (id: number, data: any) => (await getApi()).put(`/applications/${id}`, data).then(r => r.data),
  delete: async (id: number) => (await getApi()).delete(`/applications/${id}`).then(r => r.data),
};

// Comptes API
export const comptesAPI = {
  getAll: async () => (await getApi()).get("/comptes").then(r => r.data),
  getById: async (id: number) => (await getApi()).get(`/comptes/${id}`).then(r => r.data),
  create: async (data: any) => (await getApi()).post("/comptes", data).then(r => r.data),
  update: async (id: number, data: any) => (await getApi()).put(`/comptes/${id}`, data).then(r => r.data),
  delete: async (id: number) => (await getApi()).delete(`/comptes/${id}`).then(r => r.data),
};

// Tests API
export const testsAPI = {
  getAll: async (sessionId?: number) => {
    const params = sessionId ? { sessionId } : {};
    return (await getApi()).get("/tests", { params }).then(r => r.data);
  },
  create: async (data: any) => (await getApi()).post("/tests", data).then(r => r.data),
  update: async (id: number, data: any) => (await getApi()).put(`/tests/${id}`, data).then(r => r.data),
  delete: async (id: number) => (await getApi()).delete(`/tests/${id}`).then(r => r.data),
};

// Test Sessions API
export const testSessionsAPI = {
  getAll: async () => (await getApi()).get("/test-sessions").then(r => r.data),
  create: async (data: any) => (await getApi()).post("/test-sessions", data).then(r => r.data),
  update: async (id: number, data: any) => (await getApi()).put(`/test-sessions/${id}`, data).then(r => r.data),
  delete: async (id: number) => (await getApi()).delete(`/test-sessions/${id}`).then(r => r.data),
};

export default api;