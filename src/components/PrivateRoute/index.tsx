import { useAuthContext } from 'context/AuthContext';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

type PrivateRouteProps = RouteProps & {
    component: React.FC;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { authData } = useAuthContext();
    return (
        <Route
            {...rest}
            render={(props) => {
                return authData.userInfo ? <Component {...props} /> : <Redirect to='/login' />;
            }}
        />
    );
};

export default PrivateRoute;
