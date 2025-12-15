import { defineConfig } from '@umijs/max';
const proxyConfig = require('./proxy.config');

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '基因检测管理系统',
  },
  define: {
    'process.env.DEV_API_URL': JSON.stringify(process.env.DEV_API_URL || ''),
    'process.env.API_URL': JSON.stringify(process.env.API_URL || 'https://app.oriomics.cn'),
  },
  routes: [
    {
      path: '/',
      redirect: '/report/list',
    },
    // {
    //   name: '检测项目管理',
    //   path: '/project',
    //   icon: 'ExperimentOutlined',
    //   routes: [
    //     {
    //       path: '/project/list',
    //       name: '项目列表',
    //       component: './Project/List',
    //     },
    //     {
    //       path: '/project/create',
    //       name: '创建项目',
    //       component: './Project/Create',
    //       hideInMenu: true,
    //     },
    //     {
    //       path: '/project/edit/:id',
    //       name: '编辑项目',
    //       component: './Project/Edit',
    //       hideInMenu: true,
    //     },
    //   ],
    // },
    {
      name: '报告查询管理',
      path: '/report',
      icon: 'FileTextOutlined',
      routes: [
        {
          path: '/report/list',
          name: '报告列表',
          component: './Report/List',
        },
        {
          path: '/report/detail/:id',
          name: '报告详情',
          component: './Report/Detail',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '用户管理',
      path: '/user',
      icon: 'UserOutlined',
      routes: [
        {
          path: '/user/list',
          name: '用户列表',
          component: './User/List',
        },
        // {
        //   path: '/user/detail/:id',
        //   name: '用户详情',
        //   component: './User/Detail',
        //   hideInMenu: true,
        // },
      ],
    },
    {
      name: '申请管理',
      path: '/apply',
      icon: 'FileAddOutlined',
      routes: [
        {
          path: '/apply/list',
          name: '申请列表',
          component: './Apply/List',
        },
        // {
        //   path: '/user/detail/:id',
        //   name: '用户详情',
        //   component: './User/Detail',
        //   hideInMenu: true,
        // },
      ],
    },
    {
      name: '配置管理',
      path: '/config',
      icon: 'SettingOutlined',
      routes: [
        {
          path: '/config',
          name: '配置',
          component: './Config',
        },
      ],
    }
    // {
    //   name: '内容管理',
    //   path: '/content',
    //   icon: 'EditOutlined',
    //   routes: [
    //     {
    //       path: '/content/about',
    //       name: '关于我们',
    //       component: './Content/About',
    //     },
    //   ],
    // },
  ],
  npmClient: 'npm',
  proxy: proxyConfig,
});
