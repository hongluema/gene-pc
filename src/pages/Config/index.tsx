import { getInstitutionList, queryProjectList } from '@/services/project';
import { QrcodeOutlined } from '@ant-design/icons';
import { PageContainer, ProForm, ProFormSelect } from '@ant-design/pro-components';
import { Button, Card, Image, message, Modal, Row, Col } from 'antd';
import React, { useState } from 'react';
import request from '@/config/request';
import QRCode from 'qrcode';

const Config: React.FC = () => {
  const [qrcodeModalVisible, setQrcodeModalVisible] = useState(false);
  const [qrcodeUrl, setQrcodeUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [form] = ProForm.useForm();

  // 生成二维码
  const handleGenerateQRCode = async (values: any) => {
    console.log('>>>values', values);
    if (!values.program_id || !values.org_id) {
      message.warning('请选择项目和机构');
      return;
    }

    setGenerating(true);
    try {
      // 构建二维码数据
      const qrData = {
        org_id: values.org_id,
        program_id: values.program_id,
      };
      
      // 将数据转换为 JSON 字符串
      const qrDataString = JSON.stringify(qrData);
      
      // 生成二维码图片
      const dataUrl = await QRCode.toDataURL(qrDataString, {
        width: 300,
        margin: 2,
      });
      
      setQrcodeUrl(dataUrl);
      message.success('二维码生成成功');
    } catch (error: any) {
      message.error(error?.message || '生成二维码失败');
    } finally {
      setGenerating(false);
    }
  };

  // 下载二维码
  const handleDownloadQRCode = () => {
    if (!qrcodeUrl) return;
    const link = document.createElement('a');
    link.href = qrcodeUrl;
    link.download = '二维码.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('二维码下载成功');
  };

  // 关闭二维码弹窗
  const handleCloseQRCodeModal = () => {
    setQrcodeModalVisible(false);
    setQrcodeUrl('');
    form.resetFields();
  };

  // 功能模块列表
  const modules = [
    {
      id: 'qrcode',
      title: '生成二维码',
      icon: <QrcodeOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      description: '选择项目和机构生成二维码',
      onClick: () => {
        setQrcodeModalVisible(true);
      },
    },
    // 可以在这里添加更多功能模块
  ];

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        {modules.map((module) => (
          <Col xs={24} sm={12} md={8} lg={6} key={module.id}>
            <Card
              hoverable
              style={{
                height: '100%',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={module.onClick}
            >
              <div style={{ marginBottom: 16 }}>{module.icon}</div>
              <h3 style={{ marginBottom: 8 }}>{module.title}</h3>
              <p style={{ color: '#999', fontSize: 12 }}>{module.description}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 生成二维码弹窗 */}
      <Modal
        title="生成二维码"
        open={qrcodeModalVisible}
        onCancel={handleCloseQRCodeModal}
        footer={null}
        width={600}
      >
        {!qrcodeUrl ? (
          <ProForm
            form={form}
            onFinish={handleGenerateQRCode}
            submitter={{
              searchConfig: {
                submitText: '生成二维码',
              },
              resetButtonProps: {
                style: {
                  display: 'none',
                },
              },
              submitButtonProps: {
                loading: generating,
              },
            }}
          >
            <ProFormSelect
              name="program_id"
              label="项目"
              placeholder="请选择项目"
              rules={[{ required: true, message: '请选择项目' }]}
              request={async () => {
                try {
                  const res: any = await request.get('/api/projects');
                  console.log('>>>res', res);
                  const list = res?.data || [];
                  return list.map((item: API.Project) => ({
                    label: item.name,
                    value: item.id,
                  }));
                } catch (error) {
                  return [];
                }
              }}
              showSearch
              width="md"
            />
            <ProFormSelect
              name="org_id"
              label="检测机构"
              placeholder="请选择检测机构"
              rules={[{ required: true, message: '请选择检测机构' }]}
              options={[{ label: '测试机构', value: '213399541418954752' }]}
              showSearch
              width="md"
            />
          </ProForm>
        ) : (
          <div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Image
                src={qrcodeUrl}
                alt="二维码"
                style={{ maxWidth: '100%' }}
                preview={false}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Button
                type="primary"
                onClick={handleDownloadQRCode}
                style={{ marginRight: 8 }}
              >
                下载二维码
              </Button>
              <Button onClick={() => setQrcodeUrl('')}>重新生成</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Config;

