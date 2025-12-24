import {
  LogoutOutlined,
  FileTextOutlined,
  UserOutlined,
  FileAddOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import { history, useModel, useAppData, Outlet, useLocation } from '@umijs/max';
import React from 'react';

// 图标映射
const IconMap: Record<string, React.ReactNode> = {
  FileTextOutlined: <FileTextOutlined />,
  UserOutlined: <UserOutlined />,
  FileAddOutlined: <FileAddOutlined />,
  SettingOutlined: <SettingOutlined />,
};

const Layout: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { clientRoutes } = useAppData();
  const location = useLocation();

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    history.push('/login');
  };

  return (
    <ProLayout
      logo="https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg"
      title="翱锐基因检测管理系统"
      location={location}
      route={clientRoutes[1]}
      menuItemRender={(item, dom) => {
        return (
          <a
            onClick={() => {
              if (item.path) {
                history.push(item.path);
              }
            }}
          >
            {dom}
          </a>
        );
      }}
      menuDataRender={(menuData) => {
        return menuData.map((item: any) => {
          return {
            ...item,
            icon: item.icon && IconMap[item.icon],
          };
        });
      }}
      avatarProps={
        initialState?.currentUser
          ? {
              src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
              title: initialState.currentUser.name,
              size: 'small',
              render: (_: any, dom: any) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: '退出登录',
                          onClick: handleLogout,
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }
          : undefined
      }
    >
      <Outlet />
    </ProLayout>
  );
};

export default Layout;
