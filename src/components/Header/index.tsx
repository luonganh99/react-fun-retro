import React from 'react';
import { Avatar, Layout, Typography, Menu, Dropdown } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
import './index.scss';

const { Title } = Typography;
const { Header: AntHeader } = Layout;

const Header = () => {
    const { authData, onLogout } = useAuthContext();
    const { userInfo } = authData;
    const history = useHistory();

    const handleLogout = () => {
        onLogout();
        history.push('/login');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <div onClick={handleLogout}>Logout</div>
            </Menu.Item>
        </Menu>
    );
    return (
        <AntHeader
            className='test'
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
            <Link to='/boards'>
                <Title type='danger' style={{ margin: 0 }}>
                    FunRetro
                </Title>
            </Link>
            <div>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <Dropdown overlay={menu}>
                    <Link to='/user' style={{ marginLeft: 10 }}>
                        {userInfo.username} <DownOutlined style={{ marginLeft: 5 }} />
                    </Link>
                </Dropdown>
                ,
            </div>
        </AntHeader>
    );
};

export default Header;
