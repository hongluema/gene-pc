import request from '@/config/request';
import { queryUserList } from '@/services/user';
import { EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProForm, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Avatar, Descriptions, Form, message, Modal, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<API.User | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<API.User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getUsers();
  }, [])

  const getUsers = async () => {
    const res: any =await request.get('/api/samples/phone?phone=18519165666');
    console.log('>>>>res', res);
  }

  const handleDetailClick = (record: API.User) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setCurrentRecord(null);
  };

  const handleEditClick = (record: API.User) => {
    setEditRecord(record);
    setEditVisible(true);
    // 设置表单初始值
    form.setFieldsValue({
      name: record.name,
      gender: record.gender,
      age: record.age,
      idCard: (record as any).id_number || record.idCard,
      phone: record.phone,
    });
  };

  const handleCloseEdit = () => {
    setEditVisible(false);
    setEditRecord(null);
    form.resetFields();
  };

  const handleEditSubmit = async (values: any) => {
    if (!editRecord) return;

    try {
      const res: any = await request.post('/api/users/update', {
        user_id: editRecord.id,
        ...values,
      });

      if (res.success) {
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

  const columns: ProColumns<API.User>[] = [
    // {
    //   title: '头像',
    //   dataIndex: 'avatar',
    //   key: 'avatar',
    //   width: 80,
    //   search: false,
    //   render: (_, record) => (
    //     <Avatar src={record.avatar} size={48}>
    //       {record.name?.charAt(0)}
    //     </Avatar>
    //   ),
    // },
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
          <a onClick={() => handleDetailClick(record)}>
            详情
          </a>
          <a onClick={() => handleEditClick(record)}>
            编辑
          </a>
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
      <Modal
        title="用户详情"
        open={detailVisible}
        onCancel={handleCloseDetail}
        footer={null}
        width={600}
      >
        {currentRecord && (
          <Descriptions column={1} bordered>
            {/* <Descriptions.Item label="头像">
              <Avatar src={currentRecord.avatar} size={64}>
                {currentRecord.name?.charAt(0)}
              </Avatar>
            </Descriptions.Item> */}
            <Descriptions.Item label="姓名">{currentRecord.name}</Descriptions.Item>
            <Descriptions.Item label="性别">{currentRecord.gender}</Descriptions.Item>
            <Descriptions.Item label="年龄">{currentRecord.age}</Descriptions.Item>
            <Descriptions.Item label="身份证号">{(currentRecord as any).id_number || currentRecord.idCard}</Descriptions.Item>
            <Descriptions.Item label="手机号">{currentRecord.phone}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{(currentRecord as any).created_at || currentRecord.registeredAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        title="编辑用户"
        open={editVisible}
        onCancel={handleCloseEdit}
        footer={null}
        width={600}
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
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
            width="md"
          />
          <ProFormSelect
            name="gender"
            label="性别"
            options={[
              { label: '男', value: '男' },
              { label: '女', value: '女' },
            ]}
            rules={[{ required: true, message: '请选择性别' }]}
            width="md"
          />
          <ProFormText
            name="age"
            label="年龄"
            fieldProps={{
              type: 'number',
            }}
            width="md"
          />
          <ProFormText
            name="idCard"
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
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default UserList;
