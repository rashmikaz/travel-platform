import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const listingsAPI = {
  getAll: (params) => api.get("/listings", { params }),
  getOne: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post("/listings", data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  toggleLike: (id) => api.post(`/listings/${id}/like`),
};

export default api;
