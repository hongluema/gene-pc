import {
  getInstitutionList,
  getProject,
  getTestItemList,
  updateProject,
} from '@/services/project';
import {
  PageContainer,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Card, message, Spin } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const ProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<any>({});

  // 加载项目数据
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        message.error('缺少项目ID');
        history.push('/project/list');
        return;
      }

      try {
        const res = await getProject(id);
        if (res.success && res.data) {
          const project = res.data;
          setInitialValues({
            name: project.name,
            institutionId: project.institutionId,
            testItems: project.testItems,
            location: project.location,
            description: project.description,
            dateRange:
              project.startDate && project.endDate
                ? [dayjs(project.startDate), dayjs(project.endDate)]
                : undefined,
          });
        } else {
          message.error(res.errorMessage || '加载项目信息失败');
          history.push('/project/list');
        }
      } catch (error) {
        message.error('加载项目信息失败');
        history.push('/project/list');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 提交表单
  const handleSubmit = async (values: any) => {
    if (!id) return;

    setSubmitting(true);
    try {
      const data: API.ProjectForm = {
        name: values.name,
        institutionId: values.institutionId,
        testItems: values.testItems,
        description: values.description,
        location: values.location,
        startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
      };

      const res = await updateProject(id, data);
      if (res.success) {
        message.success('更新成功');
        history.push('/project/list');
      } else {
        message.error(res.errorMessage || '更新失败');
      }
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card>
        <ProForm
          initialValues={initialValues}
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

export default ProjectEdit;
