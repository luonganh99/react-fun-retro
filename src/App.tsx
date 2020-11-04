import React from 'react';
import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Board from './features/Board';
import Login from './features/Auth/pages/Login';
import SignUp from 'features/Auth/pages/SignUp';
import EditUser from './features/User/pages/EditUser';
// import Header from './components/Header';

import { Layout } from 'antd';

const { Content: AntContent } = Layout;

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect exact from='/' to='/login' />
                <Layout>
                    <Route path='/signup' component={SignUp} />
                    <Route path='/login' component={Login} />

                    <Route path='/boards' component={Board} />
                    <Route path='/user' component={EditUser} />
                </Layout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
