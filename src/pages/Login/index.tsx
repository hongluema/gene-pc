import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';
import { history } from '@umijs/max';
import styles from './index.less';
const Login: React.FC = () => {
  const handleSubmit = async (values: { phone: string; password: string }) => {
    const { phone, password } = values;

    // 验证手机号
    const validPhones = ['18519105640', '18681541964'];
    if (!validPhones.includes(phone)) {
      message.error('手机号不正确');
      return;
    }

    // 验证密码是否为手机号后六位
    const expectedPassword = phone.slice(-6);
    if (password !== expectedPassword) {
      message.error('密码不正确');
      return;
    }

    // 登录成功，保存登录状态
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', phone);
    message.success('登录成功');

    // 跳转到首页
    history.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          // logo={'@/assets/logo.png'}
          title="翱锐基因检测管理系统"
          subTitle="欢迎登录"
          onFinish={async (values) => {
            await handleSubmit(values as { phone: string; password: string });
          }}
        >
          <ProFormText
            name="phone"
            fieldProps={{
              size: 'large',
              prefix: <MobileOutlined />,
            }}
            placeholder="请输入手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式不正确',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          />
          {/* <div style={{ marginBottom: 24, color: '#999', fontSize: 14 }}>
            提示：手机号为 18519105640 或 18681541964，密码为手机号后六位
          </div> */}
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
