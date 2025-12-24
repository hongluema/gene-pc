import request from '@/config/request';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Modal, message, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useRef } from 'react';

const ApplyList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // 审核通过
  const handleApprove = (record: any) => {
    Modal.confirm({
      title: '确认审核通过',
      content: '确定要通过该申请吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const reviewTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
          const res: any = await request.post('/api/applies/update', {
            apply_id: record.apply_id,
            status: 'approved',
            review_time: reviewTime,
          });

          if (res.success || res.status_code === 200) {
            message.success('审核通过成功');
            actionRef.current?.reload();
          } else {
            message.error(res.errorMessage || '审核失败');
          }
        } catch (error: any) {
          message.error(error?.errorMessage || '审核失败，请重试');
        }
      },
    });
  };

  // 审核拒绝
  const handleReject = (record: any) => {
    Modal.confirm({
      title: '确认审核拒绝',
      content: '确定要拒绝该申请吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const reviewTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
          const res: any = await request.post('/api/applies/update', {
            apply_id: record.apply_id,
            status: 'rejected',
            review_time: reviewTime,
          });

          if (res.success || res.status_code === 200) {
            message.success('审核拒绝成功');
            actionRef.current?.reload();
          } else {
            message.error(res.errorMessage || '审核失败');
          }
        } catch (error: any) {
          message.error(error?.errorMessage || '审核失败，请重试');
        }
      },
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '申请ID',
      dataIndex: 'apply_id',
      key: 'apply_id',
      width: 150,
    },
    {
      title: '申请人姓名',
      dataIndex: 'apply_user_name',
      key: 'apply_user_name',
      width: 120,
    },
    {
      title: '申请人手机号',
      dataIndex: 'apply_user_phone',
      key: 'apply_user_phone',
      width: 130,
    },
    {
      title: '检测人姓名',
      dataIndex: 'sample_name',
      key: 'sample_name',
      width: 120,
    },
    {
      title: '检测人手机号',
      dataIndex: 'sample_phone',
      key: 'sample_phone',
      width: 130,
    },
    {
      title: '样本ID',
      dataIndex: 'sample_id',
      key: 'sample_id',
      width: 150,
    },
    {
      title: '样本试管编号',
      dataIndex: 'sample_code',
      key: 'sample_code',
      width: 150,
    },
    {
      title: '申请类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (_, record) => {
        const typeEnum = [
          { label: '作废', value: 1 },
          { label: '修改', value: 2 },
        ];
        return typeEnum.find(item => item.value === record.type)?.label || '';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const statusEnum = [
          { label: '待审核', value: 'pending' },
          { label: '审核通过', value: 'approved' },
          { label: '审核拒绝', value: 'rejected' },
        ];
        return statusEnum.find(item => item.value === record.status)?.label || '';
      },
    },
    {
      title: '审批时间',
      dataIndex: 'review_time',
      key: 'review_time',
      valueType: 'dateTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 180,
      render: (_, record) => {
        if (record.status === 'pending') {
          return (
            <Space size="small">
              <a onClick={() => handleApprove(record)}>审核通过</a>
              <a onClick={() => handleReject(record)} style={{ color: '#ff4d4f' }}>
                审核拒绝
              </a>
            </Space>
          );
        }
        return null;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<any>
        headerTitle="申请列表"
        actionRef={actionRef}
        rowKey="apply_id"
        search={{
          labelWidth: 'auto',
        }}
        request={async (params) => {
          const res: any = await request.get('/api/applies/list', {
            params: params as Record<string, any>,
          });
          console.log('>>>>res', res);
          return {
            data: res.data?.list || [],
            success: res.success,
            total: res.data?.total || 0,
          };
        }}
        columns={columns}
        scroll={{ x: 1200 }}
      />
    </PageContainer>
  );
};

export default ApplyList;