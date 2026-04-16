import axios from "axios";

// Use environment variable or fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || "https://mon-backend-rrb8.onrender.com/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  console.log("Token in localStorage:", token ? token.substring(0, 20) + "..." : "NO TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization header set:", config.headers.Authorization.substring(0, 30) + "...");
  } else {
    console.log("No token found, no Authorization header set");
  }
  return config;
});

// Response interceptor for logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    console.log("Envoi de la requête vers:", `${API_URL}/auth/token`);
    const response = await api.post("/auth/token", { username, password }, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (data: {
    username: string;
    email: string;
    role: string;
    password: string;
  }) => {
    const response = await api.post("/users", data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      email?: string;
      role?: string;
      isActive?: boolean;
      password?: string;
    },
  ) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Applications API
export const applicationsAPI = {
  getAll: async () => {
    const response = await api.get("/applications");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
  create: async (data: {
    nom: string;
    description?: string;
    version?: string;
    environnement?: string;
  }) => {
    const response = await api.post("/applications", data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      nom: string;
      description?: string;
      version?: string;
      environnement?: string;
    },
  ) => {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};

// Comptes API
export const comptesAPI = {
  getAll: async () => {
    const response = await api.get("/comptes");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/comptes/${id}`);
    return response.data;
  },
  create: async (data: {
    applicationId: number;
    username: string;
    code?: string;
    role?: string;
    commentaire?: string;
  }) => {
    const response = await api.post("/comptes", data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      applicationId: number;
    username: string;
    code?: string;
    role?: string;
    commentaire?: string;
    },
  ) => {
    const response = await api.put(`/comptes/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/comptes/${id}`);
    return response.data;
  },
};

// Tests API
export const testsAPI = {
  getAll: async (sessionId?: number) => {
    const params = sessionId ? { sessionId } : {};
    const response = await api.get("/tests", { params });
    return response.data;
  },
  create: async (data: {
    sessionId?: number;
    applicationId?: number;
    applicationNom?: string;
    version?: string;
    environnement?: string;
    fonction: string;
    precondition?: string;
    etapes?: string;
    resultatAttendu?: string;
    resultatObtenu?: string;
    statut: string;
    commentaires?: string;
  }) => {
    const response = await api.post("/tests", data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      applicationId: number;
      applicationNom?: string;
      version?: string;
      environnement?: string;
      fonction: string;
      precondition?: string;
      etapes?: string;
      resultatAttendu?: string;
      resultatObtenu?: string;
      statut: string;
      commentaires?: string;
    },
  ) => {
    const response = await api.put(`/tests/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
  },
};

// Test Sessions API
export const testSessionsAPI = {
  getAll: async () => {
    const response = await api.get("/test-sessions");
    return response.data;
  },
  create: async (data: {
    applicationId: number;
    applicationNom: string;
    dateTest?: string;
    environnement?: string;
    superviseur?: string;
    statut?: string;
  }) => {
    const response = await api.post("/test-sessions", data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      applicationId: number;
      applicationNom?: string;
      dateTest?: string;
      environnement?: string;
      superviseur?: string;
      statut?: string;
    },
  ) => {
    const response = await api.put(`/test-sessions/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/test-sessions/${id}`);
    return response.data;
  },
};

export default api;
