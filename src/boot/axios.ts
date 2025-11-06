import { boot } from 'quasar/wrappers';
import axios from 'axios';
// import { getToken } from 'src/plugins/keycloak';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
});

// api.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers = config.headers || {};
//     (config.headers as any).Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios };