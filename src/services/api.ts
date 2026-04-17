import axios, { AxiosError } from "axios";

const ONLINE_API = "https://itaccess-backend.onrender.com";
const LOCAL_API = "http://localhost:8080";

let currentApi = ONLINE_API;
let useLocal = false;

const createApi = (baseURL: string) => axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const api = createApi(ONLINE_API);

// Try online first, fallback to local
const tryApi = async (requestFn: () => Promise<any>): Promise<any> => {
  try {
    return await requestFn();
  } catch (error) {
    const axiosError = error as AxiosError;
    const isNetworkError = !axiosError.response && axiosError.message === "Network Error";
    const isCorsError = axiosError.message?.includes("CORS") || axiosError.message?.includes("Network Error");
    
    if ((isNetworkError || isCorsError) && !useLocal) {
      console.log("Online API unavailable, trying local...");
      useLocal = true;
      currentApi = LOCAL_API;
      const localApi = createApi(LOCAL_API);
      return await requestFn.call(localApi, localApi);
    }
    throw error;
  }
};

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
    console.log("Envoi de la requête vers:", `${currentApi}/auth/token`);
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.post("/auth/token", { username, password }, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    });
  },
  me: async () => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    });
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.get("/users");
      return response.data;
    });
  },
  getById: async (id: number) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    });
  },
  create: async (data: {
    username: string;
    email: string;
    role: string;
    password: string;
  }) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.post("/users", data);
      return response.data;
    });
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
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.put(`/users/${id}`, data);
      return response.data;
    });
  },
  delete: async (id: number) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    });
  },
};

// Applications API
export const applicationsAPI = {
  getAll: async () => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.get("/applications");
      return response.data;
    });
  },
  getById: async (id: number) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.get(`/applications/${id}`);
      return response.data;
    });
  },
  create: async (data: {
    nom: string;
    description?: string;
    version?: string;
    environnement?: string;
  }) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.post("/applications", data);
      return response.data;
    });
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
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.put(`/applications/${id}`, data);
      return response.data;
    });
  },
  delete: async (id: number) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.delete(`/applications/${id}`);
      return response.data;
    });
  },
};

// Comptes API
export const comptesAPI = {
  getAll: async () => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.get("/comptes");
      return response.data;
    });
  },
  getById: async (id: number) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.get(`/comptes/${id}`);
      return response.data;
    });
  },
  create: async (data: {
    applicationId: number;
    username: string;
    code?: string;
    role?: string;
    commentaire?: string;
  }) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.post("/comptes", data);
      return response.data;
    });
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
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.put(`/comptes/${id}`, data);
      return response.data;
    });
  },
  delete: async (id: number) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.delete(`/comptes/${id}`);
      return response.data;
    });
  },
};

// Tests API
export const testsAPI = {
  getAll: async (sessionId?: number) => {
    return tryApi(async (axiosInstance = api) => {
      const params = sessionId ? { sessionId } : {};
      const response = await axiosInstance.get("/tests", { params });
      return response.data;
    });
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
    image?: string;
  }) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.post("/tests", data);
      return response.data;
    });
  },
  update: async (
    id: number,
    data: {
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
      image?: string;
    },
  ) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.put(`/tests/${id}`, data);
      return response.data;
    });
  },
  delete: async (id: number) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.delete(`/tests/${id}`);
      return response.data;
    });
  },
};

// Test Sessions API
export const testSessionsAPI = {
  getAll: async () => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.get("/test-sessions");
      return response.data;
    });
  },
  create: async (data: {
    nom: string;
    description?: string;
    applicationId?: number;
    nom_document?: string;
    environnement?: string;
    version?: string;
    statut?: string;
  }) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.post("/test-sessions", data);
      return response.data;
    });
  },
  update: async (
    id: number,
    data: {
      nom: string;
      description?: string;
      applicationId?: number;
      nom_document?: string;
      environnement?: string;
      version?: string;
      statut?: string;
    },
  ) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.put(`/test-sessions/${id}`, data);
      return response.data;
    });
  },
  delete: async (id: number) => {
    return tryApi(async (axiosInstance = api) => {
      const response = await axiosInstance.delete(`/test-sessions/${id}`);
      return response.data;
    });
  },
};

export default api;
