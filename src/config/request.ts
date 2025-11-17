import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Simple axios instance
const instance: AxiosInstance = axios.create({
  baseURL: (process as any)?.env?.API_URL || 'http://localhost:8002',
  timeout: 15000,
});

// Attach token and defaults
instance.interceptors.request.use((config) => {
  // const token = localStorage.getItem(TOKEN_KEY);
  config.headers = config.headers || {};
  // if (token && !config.headers['Authorization']) {
  //   (config.headers as any)['Authorization'] = token.startsWith('Bearer ')
  //     ? token
  //     : `Bearer ${token}`;
  // }
  if (!config.headers['Accept']) (config.headers as any)['Accept'] = 'application/json';
  return config;
});

// Return response data
instance.interceptors.response.use(
  (res) => res.data,
  (error) => Promise.reject(error?.response?.data ?? error),
);

// GET wrapper
export const get = <T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance.get<any, T>(url, { ...(config || {}), params });
};

// POST wrapper
export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return instance.post<any, T>(url, data, config);
};

export default instance;
