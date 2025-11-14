import { getAboutContent } from '@/services/content';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

const ContentAbout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<API.Content | null>(null);

  // 加载内容
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAboutContent();
        if (res.success && res.data) {
          setContent(res.data);
        }
      } catch (error) {
        message.error('加载内容失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <PageContainer title="关于我们">
      <Card>
        <ProDescriptions column={1} labelStyle={{ width: 120 }}>
          <ProDescriptions.Item label="公司/组织名称">
            {content?.companyName || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label="公司介绍"
            contentStyle={{ whiteSpace: 'pre-wrap' }}
          >
            {content?.content || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="联系电话">
            {content?.contactPhone || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="联系邮箱">
            {content?.contactEmail || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="地址">
            {content?.address || '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Card>
    </PageContainer>
  );
};

export default ContentAbout;
