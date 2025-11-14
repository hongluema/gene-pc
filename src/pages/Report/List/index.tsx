import { downloadReport, queryReportList } from '@/services/report';
import {
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, message, Space } from 'antd';
import React, { useRef, useState } from 'react';
import UploadModal from './components/UploadModal';

const ReportList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState<API.Report | null>(null);

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
      title: '用户姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: '身份证号',
      dataIndex: 'userIdCard',
      key: 'idCard',
      width: 180,
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      key: 'phone',
      width: 130,
    },
    {
      title: '样本ID',
      dataIndex: 'sampleId',
      key: 'sampleId',
      width: 150,
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
      search: false,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
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
        if (record.status === 1) {
          return <Badge status="default" text="待上传" />;
        }
        return <Badge status="success" text="已上传" />;
      },
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      valueType: 'dateTime',
      width: 180,
      search: false,
    },
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
              <a onClick={() => history.push(`/report/detail/${record.id}`)}>
                <EyeOutlined /> 查看
              </a>
              <a onClick={() => handleDownload(record)}>
                <DownloadOutlined /> 下载
              </a>
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
          const res = await queryReportList({
            current: params.current,
            pageSize: params.pageSize,
            userName: params.userName,
            idCard: params.idCard,
            phone: params.phone,
            sampleId: params.sampleId,
            projectName: params.projectName,
            status: params.status,
            startTime: params.startTime,
            endTime: params.endTime,
          });
          return {
            data: res.data?.list || [],
            success: res.success,
            total: res.data?.total || 0,
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
    </PageContainer>
  );
};

export default ReportList;
