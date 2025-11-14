# 基因检测管理系统 - 后台管理前端

基于 Umi Max 4.x + Ant Design Pro Components 的后台管理系统。

## 📦 项目结构

```
src/
├── pages/                      # 页面
│   ├── Project/               # 检测项目管理
│   │   ├── List/             # 项目列表
│   │   ├── Create/           # 创建项目
│   │   └── Edit/             # 编辑项目
│   ├── Report/                # 报告查询管理
│   │   ├── List/             # 报告列表
│   │   │   └── components/   # 上传弹窗组件
│   │   └── Detail/           # 报告详情
│   ├── User/                  # 用户管理
│   │   ├── List/             # 用户列表
│   │   └── Detail/           # 用户详情
│   └── Content/               # 内容管理
│       └── About/            # 关于我们
├── services/                  # API 服务层
│   ├── typings.d.ts          # 类型定义
│   ├── project.ts            # 项目相关接口
│   ├── report.ts             # 报告相关接口
│   ├── user.ts               # 用户相关接口
│   └── content.ts            # 内容相关接口
└── .umirc.ts                 # 路由配置
```

## 🚀 功能模块

### 1. 检测项目管理 `/project`

- **项目列表**：查看所有项目，支持搜索、筛选
- **创建项目**：输入项目名称、选择检测机构和检测项目
- **编辑项目**：修改项目信息
- **二维码管理**：查看和下载项目二维码

### 2. 报告查询管理 `/report`

- **报告列表**：查看所有报告，支持多条件搜索
- **上传报告**：为待上传的报告上传 PDF 文件
- **报告详情**：查看报告详细信息和 PDF 预览
- **下载报告**：下载 PDF 报告文件

### 3. 用户管理 `/user`

- **用户列表**：查看所有用户基本信息
- **用户详情**：查看用户详细信息、身份证照片和提交记录

### 4. 内容管理 `/content`

- **关于我们**：编辑公司介绍、联系方式等信息
- **图片上传**：上传公司 Logo 和轮播图

## 🔌 API 接口说明

所有接口均需后端实现，前端已定义好接口规范：

### 项目管理接口

- `GET /api/project/list` - 获取项目列表
- `GET /api/project/:id` - 获取项目详情
- `POST /api/project/create` - 创建项目
- `PUT /api/project/update/:id` - 更新项目
- `DELETE /api/project/delete/:id` - 删除项目
- `GET /api/institution/all` - 获取检测机构列表
- `GET /api/test-item/all` - 获取检测项目配置列表

### 报告管理接口

- `GET /api/report/list` - 获取报告列表
- `GET /api/report/:id` - 获取报告详情
- `POST /api/report/upload/:id` - 上传报告

### 用户管理接口

- `GET /api/user/list` - 获取用户列表
- `GET /api/user/:id` - 获取用户详情
- `GET /api/user/:id/submissions` - 获取用户提交记录

### 内容管理接口

- `GET /api/content/about` - 获取关于我们内容
- `POST /api/content/about` - 更新关于我们内容
- `POST /api/upload` - 上传文件（图片/PDF）

## 📝 数据类型定义

所有 API 数据类型都在 `src/services/typings.d.ts` 中定义，包括：

- `API.Project` - 项目
- `API.Institution` - 检测机构
- `API.TestItemConfig` - 检测项目配置
- `API.Report` - 报告
- `API.User` - 用户
- `API.Content` - 内容

## 🛠️ 安装和运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
# 或
npm run dev
```

访问：http://localhost:8000

### 构建生产版本

```bash
npm run build
```

## 📋 依赖说明

### 核心依赖

- `@umijs/max` - Umi Max 框架
- `antd` - Ant Design UI 组件库
- `@ant-design/pro-components` - Ant Design Pro 高级组件
- `@ant-design/icons` - Ant Design 图标
- `dayjs` - 日期处理库

## 🔧 配置说明

### 路由配置

路由配置在 `.umirc.ts` 文件中，包含四个主要模块：

- 检测项目管理
- 报告查询管理
- 用户管理
- 内容管理

### 代理配置（可选）

如需配置后端 API 代理，在 `.umirc.ts` 中添加：

```typescript
export default defineConfig({
  // ... 其他配置
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // 后端地址
      changeOrigin: true,
    },
  },
});
```

## 📌 注意事项

1. **接口数据格式**：所有接口响应需遵循统一格式

   ```typescript
   {
     success: boolean,
     data: any,
     errorMessage?: string,
     errorCode?: string
   }
   ```

2. **分页参数**：列表接口需支持分页

   - 请求：`{ current: number, pageSize: number }`
   - 响应：`{ list: [], total: number }`

3. **文件上传**：上传接口接收 FormData 格式

   - 返回格式：`{ url: string, filename: string }`

4. **二维码生成**：创建项目后，后端需生成二维码并返回 URL

## 🎯 业务流程

### 项目创建流程

1. 管理员创建项目（选择机构和检测项目）
2. 后端生成二维码（包含项目 ID 和机构 ID）
3. 管理员下载打印二维码

### 样本提交流程

1. 用户扫描二维码（小程序）
2. 填写/确认信息，扫描样本条形码
3. 提交数据到后端
4. 后端创建提交记录和报告记录（状态：待上传）

### 报告上传流程

1. 管理员在报告列表找到待上传记录
2. 上传 PDF 文件
3. 用户可在小程序查询报告

## 👨‍💻 开发说明

### 添加新页面

1. 在 `src/pages/` 下创建页面文件
2. 在 `.umirc.ts` 中添加路由配置
3. 在 `src/services/` 中添加对应的 API 接口

### 添加新接口

1. 在 `src/services/typings.d.ts` 中定义类型
2. 在对应的 service 文件中添加接口方法

## 📞 技术支持

如有问题，请查看：

- [Umi Max 文档](https://umijs.org/docs/max/introduce)
- [Ant Design Pro Components 文档](https://procomponents.ant.design/)
- [Ant Design 文档](https://ant.design/)
