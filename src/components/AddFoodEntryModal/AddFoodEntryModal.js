import { Button, Col, Form, Input, InputNumber, Modal, Row, Space } from 'antd';
import generatePicker from 'antd/es/date-picker/generatePicker';
import { endOfDay, isBefore } from 'date-fns';
import PropTypes from 'prop-types';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import { useEffect, useState } from 'react';

import FoodNameInput from '../FoodNameInput/FoodNameInput';
import './AddFoodEntryModal.scss';

const DatePicker = generatePicker(dateFnsGenerateConfig);

function AddFoodEntryModal({ open, onCancel, onOk, isAdmin, foodEntry }) {
  const [form] = Form.useForm();
  const [addInProgress, setAddInProgress] = useState(false);
  const [formInvalid, setFormInvalid] = useState(false);
  const isEdit = Boolean(foodEntry);

  useEffect(() => {
    if (open && foodEntry) {
      form.setFieldsValue({ name: foodEntry.name, calories: foodEntry.calories, takenAt: new Date(foodEntry.takenAt) });
    }
  }, [open, foodEntry]);

  const handleSubmit = async (data) => {
    setAddInProgress(true);
    try {
      await onOk({ ...data, id: foodEntry?.id }, isEdit);
    } finally {
      setAddInProgress(false);
    }
  };

  const handleOnFieldsChange = () => {
    const isFormInvalid =
      form
        .getFieldsError()
        .map((e) => e.errors)
        .flat().length > 0;
    setFormInvalid(isFormInvalid);
  };

  const title = isEdit ? `Edit food entry: ${foodEntry.id}` : 'Add new food entry';

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      footer={null}
      className="add-food-entry-modal"
      afterClose={() => form.resetFields()}
    >
      <Form
        form={form}
        name="add-food-entry"
        onFinish={handleSubmit}
        onFieldsChange={handleOnFieldsChange}
        autoComplete="off"
        layout="vertical"
      >
        {isAdmin && !isEdit && (
          <Form.Item
            label="User's email"
            name="email"
            rules={[{ required: true, message: "Please input user's email!" }]}
          >
            <Input type="email" />
          </Form.Item>
        )}

        <Form.Item label="Food" name="name" rules={[{ required: true, message: 'Please input food!' }]}>
          <FoodNameInput />
        </Form.Item>

        <Form.Item label="Calories" name="calories" rules={[{ required: true, message: 'Please input calories!' }]}>
          <InputNumber min={1} max={10000} placeholder="Calorific value" />
        </Form.Item>

        <Form.Item label="Taken at" name="takenAt" rules={[{ required: true, message: 'Please input date and time!' }]}>
          <DatePicker showTime disabledDate={(current) => isBefore(endOfDay(new Date()), current)} />
        </Form.Item>

        <Form.Item>
          <Row>
            <Col span={24} align="right">
              <Space>
                <Button onClick={onCancel}>Cancel</Button>
                <Button
                  type="primary"
                  loading={addInProgress}
                  disabled={addInProgress || formInvalid}
                  htmlType="submit"
                >
                  {isEdit ? 'Update' : 'Add'}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
}

AddFoodEntryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  foodEntry: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    calories: PropTypes.number,
    takenAt: PropTypes.string
  })
};

export default AddFoodEntryModal;
