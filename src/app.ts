// 运行时配置

// import { getAuthToken } from "./utils/token";

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string; isLoggedIn: boolean }> {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return { name: '@umijs/max', isLoggedIn };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    logout: () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userPhone');
      window.location.href = '/login';
    },
  };
};

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
