import { queryUserList } from '@/services/user';
import { EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Avatar, Space } from 'antd';
import React, { useRef } from 'react';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.User>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      search: false,
      render: (_, record) => (
        <Avatar src={record.avatar} size={48}>
          {record.name?.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      search: false,
      valueEnum: {
        男: { text: '男' },
        女: { text: '女' },
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      search: false,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      width: 180,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '注册时间',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      valueType: 'dateTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '注册时间',
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
      title: '提交样本数',
      dataIndex: 'submissionCount',
      key: 'submissionCount',
      width: 120,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => history.push(`/user/detail/${record.id}`)}>
            <EyeOutlined /> 查看
          </a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.User>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        request={async (params) => {
          const res = await queryUserList({
            current: params.current,
            pageSize: params.pageSize,
            name: params.name,
            idCard: params.idCard,
            phone: params.phone,
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
        scroll={{ x: 1200 }}
      />
    </PageContainer>
  );
};

export default UserList;
