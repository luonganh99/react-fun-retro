import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import BoardDetail from './pages/BoardDetail';
import BoardList from './pages/BoardList';
import Layout from 'components/Layout';

const Board: React.FC = () => {
    const match = useRouteMatch();
    return (
        <Layout>
            <Switch>
                <Route path={`${match.url}`} exact component={BoardList} />
                <Route path={`${match.url}/:boardId`} component={BoardDetail} />
            </Switch>
        </Layout>
    );
};

export default Board;
