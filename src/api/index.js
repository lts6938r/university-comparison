import axios from 'axios';

// 创建 Axios 实例
const api = axios.create({
  baseURL: 'http://localhost:9090/api/', // 替换为后端 API 地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    // 可添加认证头，如 'Authorization': `Bearer ${token}`
  },
});

// 请求拦截器（可选，用于添加 token 或处理请求）
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// 响应拦截器（可选，用于处理响应或错误）
// api.interceptors.response.use(
//   (response) => response.data, // 直接返回数据
//   (error) => {
//     // 处理错误，例如 401 未授权
//     if (error.response?.status === 401) {
//       // 跳转登录页或提示
//       console.error('未授权，请重新登录');
//     }
//     return Promise.reject(error);
//   }
// );

export default api;