import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { ROLES } from '../config/constants';
import routes from '../config/routes';
import { useBoundStore } from '../store/store';

function PrivateRoute({ children, adminOnly }) {
  const userInfo = useBoundStore((state) => state.userInfo);
  const isLoggedIn = Boolean(userInfo);

  if (!isLoggedIn || (adminOnly && userInfo.role !== ROLES.admin)) {
    return <Navigate to={routes().login.path} state={{ from: history.location }} />;
  }
  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
  adminOnly: PropTypes.bool
};

export default PrivateRoute;
