import React from 'react';
import { Layout as AntLayout } from 'antd';
import Header from 'components/Header';

const { Content } = AntLayout;

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <AntLayout>
            {children && (
                <>
                    <Header />
                    <Content>{children}</Content>
                </>
            )}
        </AntLayout>
    );
};

export default Layout;
