import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, Card, notification } from 'antd';
import { axiosFunRetro } from 'api/axiosClient';
import Layout from 'components/Layout';
import { useAuthContext } from 'context/AuthContext';

const { Title } = Typography;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
};

const EditUser = () => {
    const { authData } = useAuthContext();
    const { userInfo } = authData;

    const [fields, setFields] = useState([
        { name: 'username', value: userInfo.username },
        { name: 'email', value: userInfo.email },
        { name: 'fullname', value: userInfo.fullName },
        { name: 'phone', value: userInfo.phone },
    ]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosFunRetro.get(`/users/${userInfo.userId}`);
            if (res.data.status === 'success') {
                setFields([
                    { name: 'username', value: res.data.data.userInfo.username },
                    { name: 'email', value: res.data.data.userInfo.email },
                    { name: 'fullname', value: res.data.data.userInfo.fullname },
                    { name: 'phone', value: res.data.data.userInfo.phone },
                ]);
            }
        };

        fetchUser();
    }, []);

    const onFinish = async (values: any) => {
        const res = await axiosFunRetro.patch(`/users/${userInfo.userId}`, values);
        if (res.data.status === 'success') {
            setFields([
                { name: 'username', value: res.data.data.userInfo.username },
                { name: 'email', value: res.data.data.userInfo.email },
                { name: 'fullname', value: res.data.data.userInfo.fullname },
                { name: 'phone', value: res.data.data.userInfo.phone },
            ]);
            notification.success({
                message: 'Update Successfully',
            });
        }
    };
    return (
        <Layout>
            <div style={{ height: '90vh', display: 'flex' }}>
                <Card hoverable style={{ width: 600, margin: 'auto' }}>
                    <Title style={{ textAlign: 'center' }}>User Information</Title>
                    <Form
                        {...layout}
                        name='basic'
                        onFinish={onFinish}
                        fields={fields}
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Form.Item
                            label='Username'
                            name='username'
                            rules={[{ message: 'Please input your username!' }]}
                        >
                            <Input disabled={true} />
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
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Layout>
    );
};

export default EditUser;
