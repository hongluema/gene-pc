import { request } from '@umijs/max';

// 获取项目列表
export async function queryProjectList(params: API.ProjectParams) {
  return request<API.Response<API.PageResult<API.Project>>>(
    '/api/project/list',
    {
      method: 'GET',
      params,
    },
  );
}

// 获取项目详情
export async function getProject(id: string) {
  return request<API.Response<API.Project>>(`/api/project/${id}`, {
    method: 'GET',
  });
}

// 创建项目
export async function createProject(data: API.ProjectForm) {
  return request<API.Response<API.Project>>('/api/project/create', {
    method: 'POST',
    data,
  });
}

// 更新项目
export async function updateProject(id: string, data: API.ProjectForm) {
  return request<API.Response<API.Project>>(`/api/project/update/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除项目
export async function deleteProject(id: string) {
  return request<API.Response<void>>(`/api/project/delete/${id}`, {
    method: 'DELETE',
  });
}

// 获取检测机构列表（用于下拉选择）
export async function getInstitutionList() {
  return request<API.Response<API.Institution[]>>('/api/institution/all', {
    method: 'GET',
  });
}

// 获取检测项目配置列表（用于多选）
export async function getTestItemList() {
  return request<API.Response<API.TestItemConfig[]>>('/api/test-item/all', {
    method: 'GET',
  });
}

// 重新生成二维码
export async function regenerateQRCode(id: string) {
  return request<API.Response<{ qrcodeUrl: string }>>(
    `/api/project/regenerate-qrcode/${id}`,
    {
      method: 'POST',
    },
  );
}
