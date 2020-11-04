import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import React from 'react';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import Header from '../../components/Header';
import { Layout } from 'antd';

const { Content: AntContent } = Layout;

const Board: React.FC<RouteComponentProps> = ({ match }) => {
    return (
        <>
            <Header />
            <AntContent>
                <Switch>
                    <Route path={`${match.url}`} exact component={BoardList} />
                    <Route path={`${match.url}/:boardId`} component={BoardDetail} />
                </Switch>
            </AntContent>
        </>
    );
};

export default Board;
