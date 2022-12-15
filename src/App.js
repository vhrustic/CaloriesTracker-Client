import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { Route, Routes } from 'react-router-dom';

import './App.scss';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { ROLES } from './config/constants';
import routes from './config/routes';
import { useBoundStore } from './store/store';

function App() {
  const userInfo = useBoundStore((state) => state.userInfo);
  const isAuthenticated = Boolean(userInfo);

  return (
    <Layout className="app-layout">
      {isAuthenticated && <Navbar />}
      <Content>
        <Routes>
          {Object.values(routes(userInfo?.role === ROLES.admin)).map(
            ({ path, index, Component, isPrivate, adminOnly }) => {
              const props = { adminOnly };
              const element = isPrivate || adminOnly ? <PrivateRoute {...props}>{Component}</PrivateRoute> : Component;

              return <Route path={path} key={path} element={element} index={index} />;
            }
          )}
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
