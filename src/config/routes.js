import { Navigate } from 'react-router-dom';

import AdminPanel from '../pages/AdminPanel/AdminPanel';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Login/Login';
import NotFound from '../pages/NotFound';
import Reports from '../pages/Reports/Reports';

const routes = (isAdmin) => ({
  root: {
    Component: <Navigate replace to={`${isAdmin ? '/admin' : '/dashboard'}`} />,
    path: '/'
  },
  dashboard: {
    Component: <Dashboard />,
    path: '/dashboard',
    isPrivate: true
  },
  adminPanel: {
    Component: <AdminPanel />,
    index: true,
    path: '/admin',
    adminOnly: true
  },
  reports: {
    Component: <Reports />,
    path: '/admin/reports',
    adminOnly: true
  },
  login: {
    Component: <Login />,
    path: '/login'
  },
  notFound: {
    Component: <NotFound />,
    path: '*'
  }
});

export default routes;
