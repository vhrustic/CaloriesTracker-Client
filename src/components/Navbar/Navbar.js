import { CaretDownFilled, LogoutOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router-dom';

import routes from '../../config/routes';
import { useBoundStore } from '../../store/store';
import './Navbar.scss';

function Navbar() {
  const userInfo = useBoundStore((state) => state.userInfo);
  const logout = useBoundStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(routes().login.path);
  };

  const menu = () => {
    const menuItems = [{ key: 'logout', label: 'Log out', icon: <LogoutOutlined />, onClick: handleLogout }];
    return <Menu items={menuItems}></Menu>;
  };

  return (
    <Header className="navbar">
      <Row>
        <Col span={12}>
          <h2>CaloriesTracker</h2>
        </Col>
        <Col span={12} align="right">
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="link" className="navbar__email">
              {userInfo?.email} &nbsp;
              <CaretDownFilled />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
}

export default Navbar;
