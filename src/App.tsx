import React from 'react';
import 'App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Board from 'features/Board';
import Login from 'features/Auth/pages/Login';
import SignUp from 'features/Auth/pages/SignUp';
import EditUser from 'features/User/pages/EditUser';
import NotFound from 'components/NotFound';
import AuthProvider from 'context/AuthContext';
import PrivateRoute from 'components/PrivateRoute';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Switch>
                    <Redirect exact from='/' to='/boards' />
                    <Route path='/signup' exact component={SignUp} />
                    <Route path='/login' exact component={Login} />
                    <PrivateRoute path='/boards' component={Board} />
                    <PrivateRoute path='/user' component={EditUser} />
                    <Route component={NotFound} />
                </Switch>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
