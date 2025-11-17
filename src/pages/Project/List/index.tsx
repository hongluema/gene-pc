import request from '@/config/request';
import {
  deleteProject,
  getInstitutionList,
  queryProjectList,
} from '@/services/project';
import { TOKEN_KEY } from '@/utils/token';
import { PlusOutlined, QrcodeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Image, message, Modal, Popconfirm, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const ProjectList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [qrcodeVisible, setQrcodeVisible] = useState(false);
  const [currentQrcode, setCurrentQrcode] = useState('');
  const [currentProjectName, setCurrentProjectName] = useState('');

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    const res: any = await request.get('/api/projects')
    console.log('>>>>res', res);
  }

  // 查看二维码
  const handleViewQRCode = (record: API.Project) => {
    setCurrentProjectName(record.name);
    setCurrentQrcode(record.qrcodeUrl || '');
    setQrcodeVisible(true);
  };

  // 下载二维码
  const handleDownloadQRCode = () => {
    if (!currentQrcode) return;
    const link = document.createElement('a');
    link.href = currentQrcode;
    link.download = `${currentProjectName}-二维码.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('二维码下载成功');
  };

  // 删除项目
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteProject(id);
      if (res.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error(res.errorMessage || '删除失败');
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const columns: ProColumns<API.Project>[] = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <a
            onClick={() => {
              history.push(`/project/edit/${record.id}`);
            }}
          >
            编辑
          </a>
          <a onClick={() => handleViewQRCode(record)}>
            <QrcodeOutlined /> 二维码
          </a>
          <Popconfirm
            title="确定要删除这个项目吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Project>
        headerTitle="项目列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              history.push('/project/create');
            }}
          >
            新建项目
          </Button>,
        ]}
        request={async (params) => {
          const res: any = await request.get('/api/projects');

          console.log('>>>>res tsble', res);
          const data = res?.content?.rows;
          return {
            data: data || [],
            success: true,
            total: data.length || 0,
          };
        }}
        columns={columns}
      />

      {/* 二维码弹窗 */}
      <Modal
        title={`${currentProjectName} - 项目二维码`}
        open={qrcodeVisible}
        onCancel={() => setQrcodeVisible(false)}
        footer={[
          <Button key="download" type="primary" onClick={handleDownloadQRCode}>
            下载二维码
          </Button>,
          <Button key="close" onClick={() => setQrcodeVisible(false)}>
            关闭
          </Button>,
        ]}
        width={500}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {currentQrcode ? (
            <Image
              src={currentQrcode}
              alt="项目二维码"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          ) : (
            <div style={{ padding: '50px', color: '#999' }}>暂无二维码</div>
          )}
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ProjectList;
