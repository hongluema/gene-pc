import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// 调试环境变量
// 在 UmiJS 中，环境变量需要以 UMI_APP_ 开头才能在浏览器中访问
console.log('>>> process.env:', process.env);
console.log('>>> UMI_APP_DEV_API_URL:', process.env.UMI_APP_DEV_API_URL);
console.log('>>> UMI_APP_API_URL:', process.env.UMI_APP_API_URL);

const baseURL = process.env.NODE_ENV === 'development' ? process.env.UMI_APP_DEV_API_URL : process.env.UMI_APP_API_URL;
console.log('>>> baseURL:', baseURL);

// Simple axios instance
const instance: AxiosInstance = axios.create({
  // 使用 UMI_APP_ 前缀的环境变量，或者通过 define 配置注入的变量
  baseURL,
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
