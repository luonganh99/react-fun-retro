import React from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { axiosFunRetro } from 'api/axiosClient';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { refreshTokenSetup } from 'utils/refreshToken';
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from 'config/auth';
import { useAuthContext } from 'context/AuthContext';

const { Title } = Typography;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
};

const Login = () => {
    const history = useHistory();
    const { onLogin } = useAuthContext();

    const onFinish = async (values: any) => {
        const res = await axiosFunRetro.post('/auth/login', values);

        if (res.data.status === 'success') {
            onLogin(res.data.data);
            history.push('/boards');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onGoogleSuccess = async (googleRes: any) => {
        console.log(googleRes);
        const apiRes = await axiosFunRetro.get('/auth/google', {
            headers: { access_token: googleRes.accessToken },
        });

        if (apiRes.data.status === 'success') {
            onLogin(apiRes.data.data);
            history.push('/boards');
        }

        // Initial refresh token
        refreshTokenSetup(googleRes);
    };

    const onFacebookSuccess = async (facebookRes: any) => {
        console.log(facebookRes);
        const apiRes = await axiosFunRetro.get('/auth/facebook', {
            headers: { Authorization: 'Bearer ' + facebookRes.accessToken },
        });

        if (apiRes.data.status === 'success') {
            onLogin(apiRes.data.data);
            history.push('/boards');
        }
    };

    const onGoogleFailure = (res: any) => {
        console.log('Google login failed ! ', res);
    };

    return (
        <div style={{ height: '100vh', display: 'flex' }}>
            <Card hoverable style={{ width: 600, margin: 'auto' }}>
                <Title style={{ textAlign: 'center' }}>Login</Title>
                <Form
                    {...layout}
                    name='basic'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    style={{
                        marginTop: 10,
                    }}
                >
                    <Form.Item
                        label='Username'
                        name='username'
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Password'
                        name='password'
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type='primary' htmlType='submit'>
                            Login
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Or <Link to='/signup'>register now!</Link>
                    </div>
                </Form>
                <div>
                    <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText='Login with Google'
                        onSuccess={onGoogleSuccess}
                        onFailure={onGoogleFailure}
                        cookiePolicy='single_host_origin'
                    />
                    <FacebookLogin
                        appId={FACEBOOK_APP_ID}
                        fields='name,email,picture'
                        callback={onFacebookSuccess}
                    />
                    ,
                </div>
            </Card>
        </div>
    );
};

export default Login;
