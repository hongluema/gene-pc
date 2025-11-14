import { request } from '@umijs/max';

// 获取用户列表
export async function queryUserList(params: API.UserParams) {
  return request<API.Response<API.PageResult<API.User>>>('/api/user/list', {
    method: 'GET',
    params,
  });
}

// 获取用户详情
export async function getUser(id: string) {
  return request<API.Response<API.User>>(`/api/user/${id}`, {
    method: 'GET',
  });
}

// 获取用户的提交记录
export async function getUserSubmissions(
  userId: string,
  params?: API.PageParams,
) {
  return request<API.Response<API.PageResult<API.Report>>>(
    `/api/user/${userId}/submissions`,
    {
      method: 'GET',
      params,
    },
  );
}
