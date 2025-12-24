// 运行时配置

// import { getAuthToken } from "./utils/token";

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  isLoggedIn: boolean;
  currentUser?: { name: string; phone: string };
}> {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userPhone = localStorage.getItem('userPhone') || '';

  return {
    name: '@umijs/max',
    isLoggedIn,
    currentUser: isLoggedIn ? { name: '管理员', phone: userPhone } : undefined,
  };
}

// 路由守卫
export function onRouteChange({ location }: any) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isLoginPage = location.pathname === '/login';

  // 如果未登录且不在登录页，则跳转到登录页
  if (!isLoggedIn && !isLoginPage) {
    window.location.href = '/login';
  }

  // 如果已登录且在登录页，则跳转到首页
  if (isLoggedIn && isLoginPage) {
    window.location.href = '/';
  }
}
