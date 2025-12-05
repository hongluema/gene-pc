import request from '@/config/request';
import { queryUserList } from '@/services/user';
import { EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Avatar, Space } from 'antd';
import React, { useEffect, useRef } from 'react';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    getUsers();
  }, [])

  const getUsers = async () => {
    const res: any =await request.get('/api/samples/phone?phone=18519165666');
    console.log('>>>>res', res);
  }

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
      // valueEnum: {
      //   男: { text: '男' },
      //   女: { text: '女' },
      // },
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
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
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
    // {
    //   title: '提交样本数',
    //   dataIndex: 'submissionCount',
    //   key: 'submissionCount',
    //   width: 120,
    //   search: false,
    // },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => console.log('>>>record', record)}>
            作废
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
          const res: any =await request.get('/api/users/list');
          console.log('>>>>res', res);
          return {
            data: res.data.list || [],
            success: res.success,
            total:  res.data.total,
          };
        }}
        columns={columns}
        scroll={{ x: 1200 }}
      />
    </PageContainer>
  );
};

export default UserList;
