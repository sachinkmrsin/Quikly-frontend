import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const message =
        (error.response.data as { error?: string })?.error ||
        error.response.statusText;
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export default api;
