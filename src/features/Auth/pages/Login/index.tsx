import React from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { axiosFunRetro } from 'api/axiosClient';
import { Link, useHistory } from 'react-router-dom';

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
    const onFinish = async (values: any) => {
        const res = await axiosFunRetro.post('/users/login', values);

        if (res.data.status === 'success') {
            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.data.userInfo));
            history.push('/boards');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ height: '100vh', display: 'flex' }}>
            <Card hoverable style={{ height: 300, width: 600, margin: 'auto' }}>
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
            </Card>
        </div>
    );
};

export default Login;
