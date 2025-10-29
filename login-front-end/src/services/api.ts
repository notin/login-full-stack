import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:2323/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", {
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    console.log('Calling to authenticate');
    try {
      const response = await axios.post("http://localhost:2323/api/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (e ){
      console.error('Failed authentication')
    }

  },
};

export const protectedService = {
  getProfile: async () => {
    const response = await api.get("/protected/profile");
    return response.data;
  },

  getData: async () => {
    const response = await api.get("/protected/data");
    return response.data;
  },
};

export default api;

