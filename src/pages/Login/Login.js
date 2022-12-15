import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../../config/constants';
import routes from '../../config/routes';
import { useBoundStore } from '../../store/store';
import appLogo from './../../assets/app-logo.png';
import './Login.scss';

function Login() {
  const [form] = Form.useForm();
  const login = useBoundStore((state) => state.login);
  const userInfo = useBoundStore((state) => state.userInfo);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [formInvalid, setFormInvalid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate(userInfo.role === ROLES.admin ? routes().adminPanel.path : routes().dashboard.path);
    }
  }, [userInfo]);

  const handleSubmit = async (data) => {
    setErrorMessage(null);
    setSubmitInProgress(true);
    try {
      await login(data);
    } catch (err) {
      setSubmitInProgress(false);
      setErrorMessage(err.response.data.message);
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

  return (
    <div className="login">
      <Row>
        <Col offset={8} span={8}>
          <Card>
            <Row>
              <Col offset={3} span={18}>
                <img src={appLogo} alt="logo" className="login__logo" />
                <h1>Sign in to CaloriesTracker</h1>
              </Col>
            </Row>

            <Form
              form={form}
              name="login"
              labelCol={{ offset: 3, span: 18 }}
              wrapperCol={{ offset: 3, span: 18 }}
              onFinish={handleSubmit}
              onFieldsChange={handleOnFieldsChange}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input type="email" size="large" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} size="large" />
              </Form.Item>

              <Row className="login__error">
                <Col offset={3} span={18}>
                  {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
                </Col>
              </Row>

              <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
                <Button
                  type="primary"
                  size="large"
                  disabled={submitInProgress || formInvalid}
                  loading={submitInProgress}
                  htmlType="submit"
                >
                  Sign in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
