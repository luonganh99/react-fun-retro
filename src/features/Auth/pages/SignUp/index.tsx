import React from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { useHistory } from 'react-router-dom';
import { axiosFunRetro } from 'api/axiosClient';
const { Title } = Typography;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
};
const SignUp = () => {
    const history = useHistory();
    const onFinish = async (values: any) => {
        delete values.confirm;
        console.log(values);
        const res = await axiosFunRetro.post('/auth/signup', values);
        if (res.data.status === 'success') {
            history.push('/login');
        }
    };
    return (
        <div style={{ height: '100vh', display: 'flex' }}>
            <Card hoverable style={{ width: 600, margin: 'auto' }}>
                <Title style={{ textAlign: 'center' }}>Sign Up</Title>
                <Form
                    {...layout}
                    name='basic'
                    onFinish={onFinish}
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
                    <Form.Item
                        name='confirm'
                        label='Confirm Password'
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        'The two passwords that you entered do not match!'
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label='Full Name'
                        name='fullname'
                        rules={[{ message: 'Please input your fullname!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='email'
                        label='E-mail'
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Phone'
                        name='phone'
                        rules={[{ message: 'Please input your phone!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type='primary' htmlType='submit'>
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SignUp;
