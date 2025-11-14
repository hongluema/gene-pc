import { request } from '@umijs/max';

// 获取关于我们内容
export async function getAboutContent() {
  return request<API.Response<API.Content>>('/api/content/about', {
    method: 'GET',
  });
}
