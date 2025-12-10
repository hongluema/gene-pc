import { downloadReport, queryReportList } from '@/services/report';
import {
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Descriptions, Form, Modal, message, Space } from 'antd';
import React, { useRef, useState } from 'react';
import UploadModal from './components/UploadModal';
import request from '@/config/request';
import Show from '@/components/Show';

const ReportList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState<API.Report | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState<API.Report | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<API.Report | null>(null);
  const [form] = Form.useForm();

  // 上传报告
  const handleUpload = (record: API.Report) => {
    setCurrentReport(record);
    setUploadModalVisible(true);
  };

  // 上传成功回调
  const handleUploadSuccess = () => {
    setUploadModalVisible(false);
    setCurrentReport(null);
    message.success('报告上传成功');
    actionRef.current?.reload();
  };

  // 查看报告
  const handleView = async (record: API.Report) => {
    const sampleDataId = (record as any).sample_data_id;
    if (!sampleDataId) {
      message.warning('样本ID不存在');
      return;
    }

    try {
      const url = `/api/report/pdf/local?pk=${sampleDataId}`;
      window.open(url, '_blank');
    } catch (error: any) {
      message.error(error?.errorMessage || '获取报告失败');
    }
  };

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

  // 查看详情
  const handleDetailClick = (record: API.Report) => {
    setDetailRecord(record);
    setDetailVisible(true);
  };

  // 关闭详情弹窗
  const handleCloseDetail = () => {
    setDetailVisible(false);
    setDetailRecord(null);
  };

  // 编辑报告
  const handleEditClick = (record: API.Report) => {
    setEditRecord(record);
    setEditVisible(true);
    // 设置表单初始值
    form.setFieldsValue({
      sample_id: (record as any).sample_id || record.sampleId,
      name: (record as any).name || record.userName,
      id_number: (record as any).id_number || record.userIdCard,
      phone: (record as any).phone || record.userPhone,
      program_name: (record as any).program_name || record.projectName,
      org_name: (record as any).org_name || record.institutionName || '测试机构',
      remark: record.remark,
    });
  };

  // 关闭编辑弹窗
  const handleCloseEdit = () => {
    setEditVisible(false);
    setEditRecord(null);
    form.resetFields();
  };

  // 提交编辑
  const handleEditSubmit = async (values: any) => {
    if (!editRecord) return;

    try {
      const res: any = await request.post('/api/samples/update', {
        id: (editRecord as any).sample_id || editRecord.sampleId,
        ...values,
      });

      if (res.status_code === 200) {
        message.success('更新成功');
        handleCloseEdit();
        // 刷新表格
        actionRef.current?.reload();
      } else {
        message.error(res.errorMessage || '更新失败');
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns: ProColumns<API.Report>[] = [
    {
      title: '样本ID',
      dataIndex: 'sample_id',
      key: 'sample_id',
      width: 150,
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '身份证号',
      dataIndex: 'id_number',
      key: 'id_number',
      width: 180,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    
    {
      title: '项目名称',
      dataIndex: 'program_name',
      key: 'program_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '检测机构',
      dataIndex: 'org_name',
      key: 'org_name',
      width: 150,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        return (record as any).org_name || '测试机构';
      },
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'dateTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '时间范围',
      dataIndex: 'timeRange',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '报告状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueEnum: {
        1: { text: '待上传', status: 'Default' },
        2: { text: '已上传', status: 'Success' },
      },
      render: (_, record) => {
        if ((record as any).sample_data_name) {
          return <Badge status="default" text="待上传" />;
        }
        return <Badge status="success" text="已上传" />;
      },
    },
    // {
    //   title: '上传时间',
    //   dataIndex: 'uploadTime',
    //   key: 'uploadTime',
    //   valueType: 'dateTime',
    //   width: 180,
    //   search: false,
    // },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.status === 1 ? (
            <a onClick={() => handleUpload(record)}>
              <UploadOutlined /> 上传
            </a>
          ) : (
              <>
                <a onClick={() => handleDetailClick(record)}>详情</a>
                <a onClick={() => handleEditClick(record)}>编辑</a>
                <Show when={(record as any).sample_data_id}>
                  <>
                  <a onClick={() => handleView(record)}>
                    <EyeOutlined /> 查看
                  </a>
                  <a onClick={() => handleDownload(record)}>
                    <DownloadOutlined /> 下载
                  </a>
                  </>
                </Show>
              
              
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Report>
        headerTitle="报告列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        request={async (params) => {
          const res: any =await request.get('/api/samples/list');
          console.log('>>>>res', res);
          return {
            data: res.data.list || [],
            success: res.success,
            total:  res.data.total,
          };
        }}
        columns={columns}
        scroll={{ x: 1500 }}
      />

      {/* 上传报告弹窗 */}
      <UploadModal
        visible={uploadModalVisible}
        report={currentReport}
        onCancel={() => {
          setUploadModalVisible(false);
          setCurrentReport(null);
        }}
        onSuccess={handleUploadSuccess}
      />

      {/* 详情弹窗 */}
      <Modal
        title="报告详情"
        open={detailVisible}
        onCancel={handleCloseDetail}
        footer={null}
        width={700}
      >
        {detailRecord && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="样本ID">
              {(detailRecord as any).sample_id || detailRecord.sampleId}
            </Descriptions.Item>
            <Descriptions.Item label="用户姓名">
              {(detailRecord as any).name || detailRecord.userName}
            </Descriptions.Item>
            <Descriptions.Item label="身份证号">
              {(detailRecord as any).id_number || detailRecord.userIdCard}
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {(detailRecord as any).phone || detailRecord.userPhone}
            </Descriptions.Item>
            <Descriptions.Item label="项目名称">
              {(detailRecord as any).program_name || detailRecord.projectName}
            </Descriptions.Item>
            <Descriptions.Item label="检测机构">
              {(detailRecord as any).org_name || '测试机构' }
            </Descriptions.Item>
            <Descriptions.Item label="报告状态">
              {detailRecord.status === 1 ? (
                <Badge status="default" text="待上传" />
              ) : (
                <Badge status="success" text="已上传" />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">
              {(detailRecord as any).created_at || detailRecord.submitTime || detailRecord.createdAt}
            </Descriptions.Item>
            {detailRecord.reportDate && (
              <Descriptions.Item label="报告日期">
                {detailRecord.reportDate}
              </Descriptions.Item>
            )}
            {detailRecord.uploadTime && (
              <Descriptions.Item label="上传时间">
                {detailRecord.uploadTime}
              </Descriptions.Item>
            )}
            {detailRecord.reportFileUrl && (
              <Descriptions.Item label="报告文件">
                <a href={detailRecord.reportFileUrl} target="_blank" rel="noopener noreferrer">
                  查看报告
                </a>
              </Descriptions.Item>
            )}
            {detailRecord.remark && (
              <Descriptions.Item label="备注">
                {detailRecord.remark}
              </Descriptions.Item>
            )}
            
          </Descriptions>
        )}
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑报告"
        open={editVisible}
        onCancel={handleCloseEdit}
        footer={null}
        width={700}
      >
        <ProForm
          form={form}
          onFinish={handleEditSubmit}
          submitter={{
            searchConfig: {
              submitText: '保存',
            },
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          <ProFormText
            name="sample_id"
            label="样本ID"
            disabled
            rules={[{ required: true, message: '请输入样本ID' }]}
            width="md"
          />
          <ProFormText
            name="name"
            label="用户姓名"
            rules={[{ required: true, message: '请输入用户姓名' }]}
            width="md"
          />
          <ProFormText
            name="id_number"
            label="身份证号"
            rules={[
              { required: true, message: '请输入身份证号' },
              { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '请输入正确的身份证号' },
            ]}
            width="md"
          />
          <ProFormText
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
            width="md"
          />
          <ProFormText
            name="program_name"
            label="项目名称"
            disabled
            rules={[{ required: true, message: '请输入项目名称' }]}
            width="md"
          />
          <ProFormText
            name="org_name"
            label="检测机构"
            disabled
            rules={[{ required: true, message: '请输入检测机构' }]}
            width="md"
          />
          {/* <ProFormText
            name="remark"
            label="备注"
            width="md"
          /> */}
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default ReportList;
