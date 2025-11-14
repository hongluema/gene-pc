import { downloadReport, getReport } from '@/services/report';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, Card, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<API.Report | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        message.error('缺少报告ID');
        history.push('/report/list');
        return;
      }

      try {
        const res = await getReport(id);
        if (res.success && res.data) {
          setReport(res.data);
        } else {
          message.error(res.errorMessage || '加载报告信息失败');
          history.push('/report/list');
        }
      } catch (error) {
        message.error('加载报告信息失败');
        history.push('/report/list');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownload = () => {
    if (!report?.reportFileUrl) {
      message.warning('暂无报告文件');
      return;
    }
    downloadReport(
      report.reportFileUrl,
      `${report.userName}-${report.sampleId}-检测报告.pdf`,
    );
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

  if (!report) {
    return null;
  }

  return (
    <PageContainer
      title="报告详情"
      extra={[
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
        >
          下载报告
        </Button>,
        <Button key="back" onClick={() => history.push('/report/list')}>
          返回
        </Button>,
      ]}
    >
      {/* 用户和样本信息 */}
      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <ProDescriptions column={2}>
          <ProDescriptions.Item label="用户姓名">
            {report.userName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="性别">
            {report.userIdCard
              ? report.userIdCard.charAt(16) === '1'
                ? '男'
                : '女'
              : '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="身份证号">
            {report.userIdCard}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="手机号">
            {report.userPhone}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="样本ID">
            {report.sampleId}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="项目名称">
            {report.projectName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="检测机构">
            {report.institutionName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="提交时间">
            {report.submitTime}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="报告生成日期">
            {report.reportDate || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="报告上传时间">
            {report.uploadTime || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="查询次数">
            {report.viewCount || 0}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="备注" span={2}>
            {report.remark || '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Card>

      {/* PDF预览 */}
      <Card title="报告预览">
        {report.reportFileUrl ? (
          <div style={{ width: '100%', height: '800px' }}>
            <iframe
              src={report.reportFileUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="检测报告"
            />
          </div>
        ) : (
          <div
            style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}
          >
            暂无报告文件
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default ReportDetail;
