import { downloadReport } from '@/services/report';
import { getUser, getUserSubmissions } from '@/services/user';
import {
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Avatar, Badge, Button, Card, Image, message, Space, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<API.User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        message.error('缺少用户ID');
        history.push('/user/list');
        return;
      }

      try {
        const res = await getUser(id);
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          message.error(res.errorMessage || '加载用户信息失败');
          history.push('/user/list');
        }
      } catch (error) {
        message.error('加载用户信息失败');
        history.push('/user/list');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 下载报告
  const handleDownload = (record: API.Report) => {
    if (!record.reportFileUrl) {
      message.warning('暂无报告文件');
      return;
    }
    downloadReport(
      record.reportFileUrl,
      `${record.userName}-${record.sampleId}-检测报告.pdf`,
    );
  };

  const columns: ProColumns<API.Report>[] = [
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '检测机构',
      dataIndex: 'institutionName',
      key: 'institutionName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '样本ID',
      dataIndex: 'sampleId',
      key: 'sampleId',
      width: 150,
    },
    {
      title: '报告状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        if (record.status === 1) {
          return <Badge status="default" text="待上传" />;
        }
        return <Badge status="success" text="已上传" />;
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.status === 2 ? (
            <>
              <a onClick={() => history.push(`/report/detail/${record.id}`)}>
                <EyeOutlined /> 查看
              </a>
              <a onClick={() => handleDownload(record)}>
                <DownloadOutlined /> 下载
              </a>
            </>
          ) : (
            <a onClick={() => history.push('/report/list')}>
              <UploadOutlined /> 上传
            </a>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageContainer
      title="用户详情"
      extra={[
        <Button key="back" onClick={() => history.push('/user/list')}>
          返回
        </Button>,
      ]}
    >
      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <Avatar src={user.avatar} size={100}>
              {user.name?.charAt(0)}
            </Avatar>
          </div>
          <div style={{ flex: 1 }}>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label="姓名">
                {user.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="性别">
                {user.gender}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="年龄">
                {user.age}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="出生日期">
                {user.birthDate || '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="身份证号">
                {user.idCard}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="手机号">
                {user.phone}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="注册时间">
                {user.registeredAt}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="最后登录">
                {user.lastLoginAt || '-'}
              </ProDescriptions.Item>
            </ProDescriptions>
          </div>
        </div>
      </Card>

      {/* 身份证信息 */}
      <Card title="身份证信息" style={{ marginBottom: 16 }}>
        <Space size="large">
          <div>
            <div style={{ marginBottom: 8, color: '#666' }}>身份证正面</div>
            {user.idCardFront ? (
              <Image
                src={user.idCardFront}
                alt="身份证正面"
                width={300}
                style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}
              />
            ) : (
              <div
                style={{
                  width: 300,
                  height: 200,
                  border: '1px dashed #d9d9d9',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                暂无图片
              </div>
            )}
          </div>
          <div>
            <div style={{ marginBottom: 8, color: '#666' }}>身份证反面</div>
            {user.idCardBack ? (
              <Image
                src={user.idCardBack}
                alt="身份证反面"
                width={300}
                style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}
              />
            ) : (
              <div
                style={{
                  width: 300,
                  height: 200,
                  border: '1px dashed #d9d9d9',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                暂无图片
              </div>
            )}
          </div>
        </Space>
      </Card>

      {/* 提交记录 */}
      <Card title="提交记录">
        <ProTable<API.Report>
          actionRef={actionRef}
          rowKey="id"
          search={false}
          options={false}
          request={async (params) => {
            if (!id) return { data: [], success: false, total: 0 };
            const res = await getUserSubmissions(id, {
              current: params.current,
              pageSize: params.pageSize,
            });
            return {
              data: res.data?.list || [],
              success: res.success,
              total: res.data?.total || 0,
            };
          }}
          columns={columns}
        />
      </Card>
    </PageContainer>
  );
};

export default UserDetail;
