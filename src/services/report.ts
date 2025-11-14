import { request } from '@umijs/max';

// 获取报告列表
export async function queryReportList(params: API.ReportParams) {
  return request<API.Response<API.PageResult<API.Report>>>('/api/report/list', {
    method: 'GET',
    params,
  });
}

// 获取报告详情
export async function getReport(id: string) {
  return request<API.Response<API.Report>>(`/api/report/${id}`, {
    method: 'GET',
  });
}

// 上传报告
export async function uploadReport(
  params: API.ReportUploadParams,
  file: FormData,
) {
  return request<API.Response<API.Report>>(`/api/report/upload/${params.id}`, {
    method: 'POST',
    data: file,
    params: {
      reportDate: params.reportDate,
      remark: params.remark,
    },
  });
}

// 下载报告
export function downloadReport(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
