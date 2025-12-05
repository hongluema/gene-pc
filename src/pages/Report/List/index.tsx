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
import request from '@/config/request';

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
        if (record.sample_data_name) {
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
    </PageContainer>
  );
};

export default ReportList;
