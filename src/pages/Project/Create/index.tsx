import {
  createProject,
  getInstitutionList,
  getTestItemList,
} from '@/services/project';
import {
  PageContainer,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Card, message } from 'antd';
import React, { useState } from 'react';

const ProjectCreate: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

  // 提交表单
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const data: API.ProjectForm = {
        name: values.name,
        institutionId: values.institutionId,
        testItems: values.testItems,
        description: values.description,
        location: values.location,
        startDate: values.dateRange?.[0],
        endDate: values.dateRange?.[1],
      };

      const res = await createProject(data);
      if (res.success) {
        message.success('创建成功');
        history.push('/project/list');
      } else {
        message.error(res.errorMessage || '创建失败');
      }
    } catch (error) {
      message.error('创建失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Card>
        <ProForm
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: '保存',
              resetText: '取消',
            },
            submitButtonProps: {
              loading: submitting,
            },
            resetButtonProps: {
              onClick: () => {
                history.push('/project/list');
              },
            },
          }}
        >
          <ProFormText
            name="name"
            label="项目名称"
            placeholder="请输入项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
            width="lg"
          />

          <ProFormSelect
            name="institutionId"
            label="检测机构"
            placeholder="请选择检测机构"
            rules={[{ required: true, message: '请选择检测机构' }]}
            request={async () => {
              const res = await getInstitutionList();
              return (res.data || []).map((item) => ({
                label: item.name,
                value: item.id,
              }));
            }}
            showSearch
            width="lg"
          />

          <ProFormSelect
            name="testItems"
            label="检测项目"
            placeholder="请选择检测项目"
            mode="multiple"
            rules={[{ required: true, message: '请选择检测项目' }]}
            request={async () => {
              const res = await getTestItemList();
              return (res.data || []).map((item) => ({
                label: item.name,
                value: item.id,
              }));
            }}
            fieldProps={{
              maxTagCount: 'responsive',
            }}
            width="lg"
          />

          <ProFormText
            name="location"
            label="检测地点"
            placeholder="请输入检测地点，例如：XX乡XX村"
            width="lg"
          />

          <ProFormDateRangePicker
            name="dateRange"
            label="有效期"
            placeholder={['开始日期', '结束日期']}
            width="lg"
          />

          <ProFormTextArea
            name="description"
            label="项目描述"
            placeholder="请输入项目描述"
            fieldProps={{
              rows: 4,
            }}
            width="lg"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default ProjectCreate;
