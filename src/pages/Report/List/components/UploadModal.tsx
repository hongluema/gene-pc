import { uploadReport } from '@/services/report';
import { InboxOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

interface UploadModalProps {
  visible: boolean;
  report: API.Report | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  visible,
  report,
  onCancel,
  onSuccess,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFinish = async (values: any) => {
    if (!report) {
      message.error('报告信息不存在');
      return false;
    }

    if (fileList.length === 0) {
      message.error('请上传报告文件');
      return false;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj as File);

      const res = await uploadReport(
        {
          id: report.id,
          reportDate: values.reportDate,
          remark: values.remark,
        },
        formData,
      );

      if (res.success) {
        message.success('上传成功');
        setFileList([]);
        onSuccess();
        return true;
      } else {
        message.error(res.errorMessage || '上传失败');
        return false;
      }
    } catch (error) {
      message.error('上传失败，请重试');
      return false;
    } finally {
      setUploading(false);
    }
  };

  return (
    <ModalForm
      title="上传检测报告"
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          setFileList([]);
          onCancel();
        }
      }}
      onFinish={handleFinish}
      modalProps={{
        destroyOnClose: true,
      }}
      submitter={{
        submitButtonProps: {
          loading: uploading,
        },
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <p>
          <strong>用户姓名：</strong>
          {report?.userName}
        </p>
        <p>
          <strong>样本ID：</strong>
          {report?.sampleId}
        </p>
        <p>
          <strong>项目名称：</strong>
          {report?.projectName}
        </p>
      </div>

      <Upload.Dragger
        fileList={fileList}
        beforeUpload={(file) => {
          const isPDF = file.type === 'application/pdf';
          if (!isPDF) {
            message.error('只能上传PDF格式文件！');
            return false;
          }
          const isLt10M = file.size / 1024 / 1024 < 10;
          if (!isLt10M) {
            message.error('文件大小不能超过10MB！');
            return false;
          }
          setFileList([file]);
          return false;
        }}
        onRemove={() => {
          setFileList([]);
        }}
        maxCount={1}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">仅支持PDF格式，文件大小不超过10MB</p>
      </Upload.Dragger>

      <ProFormDatePicker
        name="reportDate"
        label="报告生成日期"
        width="lg"
        fieldProps={{
          style: { width: '100%' },
        }}
      />

      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注信息"
        fieldProps={{
          rows: 3,
        }}
      />
    </ModalForm>
  );
};

export default UploadModal;
