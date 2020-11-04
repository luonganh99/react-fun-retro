import React from 'react';
import { Avatar, Layout, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Link: AntLink } = Typography;
const { Header: AntHeader } = Layout;

const Header = () => {
    const userInfo = JSON.parse(localStorage.getItem('user')!);

    return (
        <AntHeader
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
            <Link to='/boards'>
                <Title type='danger' style={{ margin: 0 }}>
                    FunRetro
                </Title>
            </Link>
            <div>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <Link to='/user' style={{ marginLeft: 10 }}>
                    <AntLink type='warning'>{userInfo?.username}</AntLink>
                </Link>
            </div>
        </AntHeader>
    );
};

export default Header;
