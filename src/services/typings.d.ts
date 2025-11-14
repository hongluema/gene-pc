declare namespace API {
  // ============= 通用类型 =============
  type Response<T = any> = {
    success: boolean;
    data: T;
    errorMessage?: string;
    errorCode?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type PageResult<T> = {
    list: T[];
    total: number;
    current: number;
    pageSize: number;
  };

  // ============= 检测机构 =============
  type Institution = {
    id: string;
    name: string;
    code?: string;
    contactPerson?: string;
    contactPhone?: string;
    address?: string;
    description?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  // ============= 检测项目配置 =============
  type TestItemConfig = {
    id: string;
    name: string;
    code?: string;
    description?: string;
    sortOrder?: number;
    status?: number;
  };

  // ============= 项目 =============
  type Project = {
    id: string;
    name: string;
    institutionId: string;
    institutionName?: string;
    testItems: string[]; // 检测项目ID数组
    testItemNames?: string[]; // 检测项目名称数组
    description?: string;
    qrcodeUrl?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type ProjectParams = PageParams & {
    name?: string;
    institutionId?: string;
    status?: number;
  };

  type ProjectForm = {
    name: string;
    institutionId: string;
    testItems: string[];
    description?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  };

  // ============= 用户 =============
  type User = {
    id: string;
    openid?: string;
    name: string;
    idCard: string;
    gender: string;
    age?: number;
    birthDate?: string;
    phone: string;
    avatar?: string;
    idCardFront?: string;
    idCardBack?: string;
    ocrData?: any;
    registeredAt?: string;
    lastLoginAt?: string;
    submissionCount?: number;
  };

  type UserParams = PageParams & {
    name?: string;
    idCard?: string;
    phone?: string;
    startTime?: string;
    endTime?: string;
  };

  // ============= 样本提交记录 =============
  type Submission = {
    id: string;
    userId: string;
    userName?: string;
    projectId: string;
    projectName?: string;
    institutionId: string;
    institutionName?: string;
    sampleId: string;
    submitTime?: string;
    submitLocation?: string;
    status?: number;
    createdAt?: string;
  };

  // ============= 报告 =============
  type Report = {
    id: string;
    submissionId: string;
    userId: string;
    userName?: string;
    userIdCard?: string;
    userPhone?: string;
    sampleId: string;
    projectName?: string;
    institutionName?: string;
    reportFileUrl?: string;
    reportDate?: string;
    uploadTime?: string;
    viewCount?: number;
    status: number; // 1待上传 2已上传
    remark?: string;
    submitTime?: string;
    createdAt?: string;
  };

  type ReportParams = PageParams & {
    userName?: string;
    idCard?: string;
    phone?: string;
    sampleId?: string;
    projectName?: string;
    status?: number;
    startTime?: string;
    endTime?: string;
  };

  type ReportUploadParams = {
    id: string;
    reportDate?: string;
    remark?: string;
  };

  // ============= 内容管理 =============
  type Content = {
    id?: string;
    type: string;
    title?: string;
    content?: string;
    companyName?: string;
    contactPhone?: string;
    contactEmail?: string;
    address?: string;
    logoUrl?: string;
    images?: string[];
    updatedAt?: string;
    updatedBy?: string;
  };

  // ============= 上传 =============
  type UploadResult = {
    url: string;
    filename: string;
  };
}
